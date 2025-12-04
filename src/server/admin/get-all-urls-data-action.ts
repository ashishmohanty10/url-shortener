'use server'

import prisma from '@/db/prisma'
import { redis } from '@/lib/redis'
import { env } from '@/lib/env'
import { requireAuth } from '@/utils/auth-guard'
import { AdminUrlType } from '@/utils/types'
import { Prisma } from '../../../prisma/generated/prisma/client'

const time = Number(env.GET_DATA_CACHE_TIME) || 300

type FilterType = 'pending' | 'approved' | 'all'

export async function getAllUrlsDataAction(
  page = 1,
  limit = 15,
  search = '',
  filter: FilterType = 'pending'
): Promise<{
  urls: AdminUrlType[]
  total: number
  totalPages: number
}> {
  const { user } = await requireAuth()

  if (user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const cacheKey = `admin:urls:page=${page}:limit=${limit}:filter=${filter || 'all'}:search=${search || 'all'}`

  try {
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch (err) {
    console.error('Redis get error:', err)
  }

  const whereFilter: Prisma.UrlWhereInput = {
    flagged: true,
  }

  if (filter === 'pending') {
    whereFilter.approved = false
  } else if (filter === 'approved') {
    whereFilter.approved = true
  }

  if (search) {
    whereFilter.OR = [
      { originalUrl: { contains: search, mode: 'insensitive' as const } },
      { shortUrl: { contains: search, mode: 'insensitive' as const } },
      { tags: { some: { name: { contains: search, mode: 'insensitive' as const } } } },
    ]
  }

  const skip = (page - 1) * limit

  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      skip,
      take: limit,
      where: whereFilter,
      include: { user: true, tags: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.url.count({ where: whereFilter }),
  ])

  const result = {
    urls: urls.map(url => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      clicks: url.clicks,
      flagged: url.flagged,
      approved: url.approved,
      flagReason: url.flagReason,
      flagCategory: url.flagCategory,
      user: {
        id: url.user.id,
        email: url.user.email,
        name: url.user.name,
        image: url.user.image,
      },
      tags: url.tags.map(t => t.name),
    })),
    total,
    totalPages: Math.ceil(total / limit),
  }

  try {
    await redis.setex(cacheKey, time, JSON.stringify(result))
  } catch (err) {
    console.error('Redis set error:', err)
  }

  return result
}
