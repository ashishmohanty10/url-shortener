import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { env } from '@/lib/env'

const BATCH_SIZE = Number(env.BATCH_SIZE) || 100
const FLUSH_INTERVAL_MS = Number(env.FLUSH_INTERVAL_MS) || 3000

let clickBatch: any[] = []
let flushTimeout: NodeJS.Timeout | null = null

async function flushBatch() {
  if (clickBatch.length === 0) return

  const batch = [...clickBatch]
  clickBatch = []

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
      })

      const counts = batch.reduce<Record<string, number>>((acc, c) => {
        acc[c.urlId] = (acc[c.urlId] || 0) + 1
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
  } catch (error) {
    console.error('Failed to flush batch:', error)
    clickBatch.unshift(...batch)
  }
}

export async function processClickQueue() {
  console.log('Click queue processor started')
  while (true) {
    try {
      const clickData = await redis.brpop(env.QUEUE_NAME, 1)

      if (!clickData) continue

      const [, rawData] = clickData
      const click = JSON.parse(rawData)

      clickBatch.push(click)

      if (clickBatch.length >= BATCH_SIZE) {
        await flushBatch()
        if (flushTimeout) {
          clearTimeout(flushTimeout)
          flushTimeout = null
        }
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(flushBatch, FLUSH_INTERVAL_MS)
      }
    } catch (error) {
      console.error('Error processing queue:', error)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await flushBatch()
  await prisma.$disconnect()
  await redis.quit()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await flushBatch()
  await prisma.$disconnect()
  await redis.quit()
  process.exit(0)
})

if (require.main === module) {
  processClickQueue().catch(console.error)
}
