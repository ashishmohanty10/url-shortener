'use server'

import { URLS } from '@/app/(user)/links/columns'
import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { requireAuth } from '@/utils/auth-guard'

const time = Number(env.GET_DATA_CACHE_TIME) || 300
export async function getData(
  page = 1,
  limit = 15,
  filter = ''
): Promise<{
  urls: URLS[]
  total: number
  totalPages: number
}> {
  const session = await requireAuth()
  const userId = session.user.id

  const skip = (page - 1) * limit
  const cacheKey = `urls:${userId}:page=${page}:filter=${filter || 'all'}`
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('Redis get error:', error)
  }

  const where = {
    userId,
    ...(filter
      ? {
          OR: [
            { originalUrl: { contains: filter, mode: 'insensitive' as const } },
            { shortUrl: { contains: filter, mode: 'insensitive' as const } },
            { tags: { some: { name: { contains: filter, mode: 'insensitive' as const } } } },
          ],
        }
      : {}),
  }

  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalUrl: true,
        shortUrl: true,
        createdAt: true,
        clicks: true,
        tags: {
          select: { name: true },
        },
      },
    }),
    prisma.url.count({ where }),
  ])
  const result = {
    urls: urls.map(url => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      clicks: url.clicks,
      tags: url.tags.map(tag => tag.name),
    })),
    total,
    totalPages: Math.ceil(total / limit),
  }

  await redis.setex(cacheKey, time, JSON.stringify(result))
  return result
}
