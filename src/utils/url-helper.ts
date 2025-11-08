import { env } from '@/lib/env'
import { extractClickMetadataFromHeaders } from '@/lib/geo'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { headers } from 'next/headers'
import { UrlData } from './types'

async function getUrlFromCache(code: string): Promise<UrlData | null> {
  const cacheKey = `url:${code}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as UrlData
    }
  } catch (error) {
    console.error('Redis get error:', error)
  }

  return null
}

async function setUrlCache(code: string, data: UrlData): Promise<void> {
  const cacheKey = `url:${code}`

  try {
    await redis.setex(cacheKey, env.TTL, JSON.stringify(data))
  } catch (error) {
    console.error('Redis setex error:', error)
  }
}

export async function getUrlData(code: string): Promise<UrlData | null> {
  const cached = await getUrlFromCache(code)
  if (cached) {
    return cached
  }

  try {
    const data = await prisma.url.findUnique({
      where: { shortUrl: code },
      select: { id: true, originalUrl: true },
    })

    if (data) {
      setUrlCache(code, data).catch(err => console.error('Background cache set failed:', err))
    }

    return data
  } catch (error) {
    console.error('Database error fetching URL:', error)
    return null
  }
}

export async function enqueueClickAnalytics(
  urlId: string,
  headersList: Awaited<ReturnType<typeof headers>>
): Promise<void> {
  try {
    const clickData = extractClickMetadataFromHeaders(headersList)

    await redis.lpush(
      env.QUEUE_NAME,
      JSON.stringify({
        urlId,
        createdAt: new Date().toISOString(),
        ...clickData,
      })
    )
  } catch (error) {
    console.error('Error enqueuing click analytics:', error)
  }
}
