'use server'

import { prisma } from '@/db/prisma'
import { env } from '@/lib/env'
import { redis } from '@/lib/redis'
import { requireAuth } from '@/utils/auth-guard'
import { UserUrlType } from '@/utils/types'

const time = Number(env.GET_DATA_CACHE_TIME) || 300

export async function getUserUrlAction(
  page = 1,
  limit = 15,
  filter = ''
): Promise<{
  urls: UserUrlType[]
  total: number
  totalPages: number
}> {
  const { user } = await requireAuth()
  const userId = user.id

  const skip = (page - 1) * limit
  const cacheKey = `urls:${userId}:page=${page}:limit=${limit}:filter=${filter || 'all'}`

  // Try to read from cache
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
        updatedAt: true,
        clicks: true,
        flagged: true,
        approved: true,
        flagReason: true,
        flagCategory: true,
        tags: true,
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
      flagged: url.flagged,
      approved: url.approved,
      flagReason: url.flagReason,
      flagCategory: url.flagCategory,
    })),
    total,
    totalPages: Math.ceil(total / limit),
  }

  try {
    await redis.setex(cacheKey, time, JSON.stringify(result))
  } catch (error) {
    console.error('Redis set error:', error)
  }

  return result
}
