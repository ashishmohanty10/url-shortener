import { prisma } from '@/db/prisma'
import { redis } from '@/lib/redis'
import { env } from '@/lib/env'
import { UrlClick } from '../../prisma/generated/prisma'

const BATCH_SIZE = Number(env.BATCH_SIZE) || 50
const FLUSH_INTERVAL_MS = Number(env.FLUSH_INTERVAL_MS) || 1000
const MAX_RETRIES = Number(env.MAX_RETRY) || 3
const PERIODIC_FLUSH_INTERVAL = FLUSH_INTERVAL_MS * 2

let clickBatch: Array<UrlClick> = []
let flushTimeout: NodeJS.Timeout | null = null
let isShuttingDown = false

async function fetchGeo(ip: string) {
  if (!ip || ip === '::1' || ip === '127.0.0.1') {
    return { country: null, city: null }
  }

  const cacheKey = `geo:${ip}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      const data = JSON.parse(cached)
      return { country: data.country, city: data.city }
    }
  } catch (err) {
    console.error('Redis geo cache read error:', err)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${env.GEO_API_BASE_URL}/${ip}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const data = await res.json()

    if (!data.success) {
      // Cache negative results too (shorter TTL)
      const geo = { country: null, city: null }
      await redis.setex(cacheKey, 60 * 60, JSON.stringify(geo))
      return geo
    }

    const geo = {
      country: data.country ?? null,
      city: data.city ?? null,
    }

    // Cache for 7 days
    await redis.setex(cacheKey, 60 * 60 * 24 * 7, JSON.stringify(geo))
    return geo
  } catch (err) {
    console.error('Geo lookup failed for IP:', ip, err)
    return { country: null, city: null }
  }
}

// Invalidate cache for affected users
async function invalidateCacheForUrls(urlIds: string[]) {
  try {
    const urls = await prisma.url.findMany({
      where: { id: { in: urlIds } },
      select: { userId: true },
    })

    const uniqueUserIds = new Set(urls.map(url => url.userId))

    await Promise.all(
      Array.from(uniqueUserIds).map(async userId => {
        try {
          // Invalidate user's URL cache
          const cacheKey = `urls:${userId}`
          await redis.del(cacheKey)
        } catch (err) {
          console.error(`Failed to invalidate cache for user ${userId}:`, err)
        }
      })
    )

    console.log(`Cache invalidated for ${uniqueUserIds.size} users`)
  } catch (error) {
    console.error('Failed to invalidate cache:', error)
  }
}

// Main batch flush function
async function flushBatch() {
  if (clickBatch.length === 0) return

  const batch = [...clickBatch]
  clickBatch = []

  console.log(`Flushing batch of ${batch.length} clicks...`)

  try {
    await prisma.$transaction(async tx => {
      await tx.urlClick.createMany({
        data: batch.map(click => ({
          urlId: click.urlId,
          ip: click.ip || null,
          referer: click.referer || null,
          userAgent: click.userAgent ? JSON.stringify(click.userAgent) : null,
          acceptLanguage: click.acceptLanguage || null,
          device: click.device ? JSON.stringify(click.device) : null,
          os: click.os ? JSON.stringify(click.os) : null,
          browser: click.browser ? JSON.stringify(click.browser) : null,
          isBot: click.isBot || false,
          country: click.country || null,
          city: click.city || null,
        })),
        skipDuplicates: true,
      })

      // Count clicks per URL
      const counts = batch.reduce<Record<string, number>>((acc, click) => {
        acc[click.urlId] = (acc[click.urlId] || 0) + 1
        return acc
      }, {})

      // Update click counts
      await Promise.all(
        Object.entries(counts).map(([urlId, count]) =>
          tx.url.update({
            where: { id: urlId },
            data: { clicks: { increment: count } },
          })
        )
      )
    })

    console.log(`Successfully flushed ${batch.length} clicks`)

    // Invalidate cache for affected URLs
    const urlIds = Array.from(new Set(batch.map(click => click.urlId)))
    await invalidateCacheForUrls(urlIds)
  } catch (error) {
    console.error('Failed to flush batch:', error)

    // Schedule retry with exponential backoff
    await scheduleRetry(batch, 1)
  }
}

// Retry failed batches with exponential backoff
async function scheduleRetry(batch: Array<UrlClick>, attempt: number) {
  if (attempt > MAX_RETRIES) {
    console.error(`Max retries (${MAX_RETRIES}) exceeded. Lost ${batch.length} clicks.`)
    return
  }

  const delay = Math.min(1000 * Math.pow(2, attempt), 10000) // Max 10s delay
  console.log(`Scheduling retry attempt ${attempt}/${MAX_RETRIES} in ${delay}ms...`)

  setTimeout(async () => {
    try {
      await flushRetryBatch(batch)
      console.log(`Retry attempt ${attempt} succeeded`)
    } catch (error) {
      console.error(`Retry attempt ${attempt} failed:`, error)
      await scheduleRetry(batch, attempt + 1)
    }
  }, delay)
}

// Flush retry batch (separate from main batch to avoid race conditions)
async function flushRetryBatch(batch: Array<UrlClick>) {
  await prisma.$transaction(async tx => {
    await tx.urlClick.createMany({
      data: batch.map(click => ({
        urlId: click.urlId,
        ip: click.ip || null,
        referer: click.referer || null,
        userAgent: click.userAgent ? JSON.stringify(click.userAgent) : null,
        acceptLanguage: click.acceptLanguage || null,
        device: click.device ? JSON.stringify(click.device) : null,
        os: click.os ? JSON.stringify(click.os) : null,
        browser: click.browser ? JSON.stringify(click.browser) : null,
        isBot: click.isBot || false,
        country: click.country || null,
        city: click.city || null,
      })),
      skipDuplicates: true,
    })

    const counts = batch.reduce<Record<string, number>>((acc, click) => {
      acc[click.urlId] = (acc[click.urlId] || 0) + 1
      return acc
    }, {})

    await Promise.all(
      Object.entries(counts).map(([urlId, count]) =>
        tx.url.update({
          where: { id: urlId },
          data: { clicks: { increment: count } },
        })
      )
    )
  })

  // Invalidate cache
  const urlIds = Array.from(new Set(batch.map(click => click.urlId)))
  await invalidateCacheForUrls(urlIds)
}

// Validate click data from queue
function validateClickData(data: any): data is UrlClick {
  if (!data || typeof data !== 'object') {
    return false
  }

  if (!data.urlId || typeof data.urlId !== 'string') {
    return false
  }

  return true
}

// Main queue processor
export async function processClickQueue() {
  console.log('🚀 Click queue processor started')
  console.log(`📊 Batch size: ${BATCH_SIZE}, Flush interval: ${FLUSH_INTERVAL_MS}ms`)

  // Periodic flush as safety net
  const periodicFlush = setInterval(() => {
    if (clickBatch.length > 0 && !isShuttingDown) {
      console.log(`⏰ Periodic flush triggered: ${clickBatch.length} clicks`)
      flushBatch()
    }
  }, PERIODIC_FLUSH_INTERVAL)

  while (!isShuttingDown) {
    try {
      // Block and wait for data from Redis queue (1 second timeout)
      const clickData = await redis.brpop(env.QUEUE_NAME, 1)

      if (!clickData) continue

      const [, rawData] = clickData
      let click: UrlClick

      // Parse and validate data
      try {
        click = JSON.parse(rawData)
      } catch (parseError) {
        console.error('Failed to parse click data:', parseError)
        continue
      }

      if (!validateClickData(click)) {
        console.error('Invalid click data structure:', click)
        continue
      }

      // Fetch geo data
      const geo = await fetchGeo(click.ip || '')
      click.country = geo.country
      click.city = geo.city

      // Add to batch
      clickBatch.push(click)

      // Flush if batch is full
      if (clickBatch.length >= BATCH_SIZE) {
        await flushBatch()

        // Clear timeout since we just flushed
        if (flushTimeout) {
          clearTimeout(flushTimeout)
          flushTimeout = null
        }
      } else if (!flushTimeout) {
        // Schedule flush if not already scheduled
        flushTimeout = setTimeout(() => {
          flushBatch()
          flushTimeout = null
        }, FLUSH_INTERVAL_MS)
      }
    } catch (error) {
      console.error('❌ Error processing queue:', error)

      // Wait before retrying to avoid tight error loops
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Cleanup
  clearInterval(periodicFlush)
  console.log('🛑 Click queue processor stopped')
}

// Graceful shutdown handlers
async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Starting graceful shutdown...`)
  isShuttingDown = true

  // Clear any pending flush timeout
  if (flushTimeout) {
    clearTimeout(flushTimeout)
    flushTimeout = null
  }

  try {
    // Flush remaining clicks
    if (clickBatch.length > 0) {
      console.log(`Flushing ${clickBatch.length} remaining clicks...`)
      await flushBatch()
    }

    // Close connections
    console.log('Closing database connection...')
    await prisma.$disconnect()

    console.log('Closing Redis connection...')
    await redis.quit()

    console.log('✅ Graceful shutdown complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

// Handle uncaught errors
process.on('uncaughtException', error => {
  console.error('💥 Uncaught exception:', error)
  gracefulShutdown('UNCAUGHT_EXCEPTION')
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled rejection at:', promise, 'reason:', reason)
  gracefulShutdown('UNHANDLED_REJECTION')
})

// Start the worker if run directly
if (require.main === module) {
  processClickQueue().catch(error => {
    console.error('💥 Fatal error in queue processor:', error)
    process.exit(1)
  })
}
