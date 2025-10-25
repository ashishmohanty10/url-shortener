import { env } from '@/lib/env'
import { extractClickMetadata } from '@/lib/geo'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import STATUS_CODES from '@/utils/status-codes'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { code: string } }) {
  try {
    const { code } = await params
    const cacheKey = `url:${code}`
    let urlData = await redis.get(cacheKey)
    if (!urlData) {
      const url = await prisma.url.findUnique({
        where: {
          shortUrl: code,
        },
        select: {
          id: true,
          originalUrl: true,
        },
      })

      if (!url) {
        return NextResponse.json({ error: 'Url not found' }, { status: STATUS_CODES.NOT_FOUND })
      }

      urlData = JSON.stringify(url)
      await redis.setex(cacheKey, parseInt(env.TTL), urlData)
    }
    const { id: urlId, originalUrl } = JSON.parse(urlData)
    const clickData = extractClickMetadata(req)
    await redis.lpush(env.QUEUE_NAME, JSON.stringify({ urlId, ...clickData }))

    return NextResponse.json({ originalUrl }, { status: STATUS_CODES.OK })
  } catch (error) {
    console.error('Error fetching URL:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error?.toString() },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }
}
