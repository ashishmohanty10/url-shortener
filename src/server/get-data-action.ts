'use server'

import { URLS } from '@/app/(user)/links/columns'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/utils/auth-guard'

export async function getData(): Promise<URLS[]> {
  await requireAuth()
  const urls = await prisma.url.findMany({
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
  })

  return urls
    .map(url => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      clicks: url.clicks,
      tags: url.tags.map(tag => tag.name),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
