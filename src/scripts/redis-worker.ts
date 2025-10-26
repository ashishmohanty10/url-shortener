import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

export async function processClickQueue() {
  while (true) {
    console.log('processClickQueue started')
    const clickData = await redis.brpop(process.env.QUEUE_NAME!, 0)
    if (!clickData) continue

    const [, rawData] = clickData
    const click = JSON.parse(rawData)

    try {
      await prisma.urlClick.create({
        data: {
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
        },
      })
    } catch (error) {
      console.error('Error processing click:', error)
    }
  }
}

processClickQueue().catch(console.error)
