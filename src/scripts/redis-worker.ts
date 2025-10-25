import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

async function processClickQueue() {
  while (true) {
    const clickData = await redis.brpop(env.QUEUE_NAME, 0)
    if (!clickData) continue

    const [, rawData] = clickData
    const click = JSON.parse(rawData)

    try {
      await prisma.urlClick.create({
        data: {
          urlId: click.urlId,
          ip: click.ip,
          referer: click.referer,
          userAgent: click.userAgent,
          acceptLanguage: click.acceptLanguage,
          device: click.device,
          os: click.os,
          browser: click.browser,
          isBot: click.isBot,
          country: click.country,
          city: click.city,
        },
      })
    } catch (error) {
      console.error('Error processing click:', error)
    }
  }
}

processClickQueue().catch(console.error)
