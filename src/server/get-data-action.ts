'use server'

import { URLS } from '@/app/(user)/links/columns'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/utils/auth-guard'

export async function getData(
  page = 1,
  limit = 15
): Promise<{
  urls: URLS[]
  total: number
  totalPages: number
}> {
  const session = await requireAuth()
  const userId = session.user.id

  const skip = (page - 1) * limit

  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      where: { userId },
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
    prisma.url.count({ where: { userId } }),
  ])

  return {
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
}
