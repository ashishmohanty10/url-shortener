import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { env } from '@/lib/env'

const BATCH_SIZE = Number(env.BATCH_SIZE) || 50
const FLUSH_INTERVAL_MS = Number(env.FLUSH_INTERVAL_MS) || 5000

let clickBatch: any[] = []
let flushTimeout: NodeJS.Timeout | null = null

async function flushBatch() {
  if (clickBatch.length === 0) return

  const batch = [...clickBatch]
  clickBatch = []

  try {
    await prisma.$transaction(async tx => {
      const created = await tx.urlClick.createMany({
        data: batch.map(click => ({
          urlId: click.urlId,
          ip: click.ip,
          referer: click.referer,
          userAgent: JSON.stringify(click.userAgent),
          acceptLanguage: click.acceptLanguage,
          device: JSON.stringify(click.device),
          os: JSON.stringify(click.os),
          browser: JSON.stringify(click.browser),
          isBot: click.isBot,
          country: click.country,
          city: click.city,
        })),
      })

      // Increment click counts per URL
      const counts = batch.reduce<Record<string, number>>((acc, c) => {
        acc[c.urlId] = (acc[c.urlId] || 0) + 1
        return acc
      }, {})

      // Update click counts
      const updateResults = await Promise.all(
        Object.entries(counts).map(async ([urlId, count]) => {
          const updated = await tx.url.update({
            where: { id: urlId },
            data: { clicks: { increment: count } },
          })
          return updated
        })
      )
    })
  } catch (e) {
    console.error(e)
    clickBatch.unshift(...batch)
  }
}

export async function processClickQueue() {
  while (true) {
    try {
      const clickData = await redis.brpop(env.QUEUE_NAME!, 0)

      if (!clickData) {
        continue
      }

      const [, rawData] = clickData
      const click = JSON.parse(rawData)

      clickBatch.push(click)

      if (clickBatch.length >= BATCH_SIZE) {
        await flushBatch()
        if (flushTimeout) clearTimeout(flushTimeout)
        flushTimeout = null
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(flushBatch, FLUSH_INTERVAL_MS)
      }
    } catch (error) {
      console.error(error)
    }
  }
}

processClickQueue().catch(console.error)
