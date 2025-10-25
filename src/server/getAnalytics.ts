'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/utils/auth-guard'

export async function getUrlAnalytics(shortCode: string) {
  try {
    const session = await requireAuth()
    const url = await prisma.url.findUnique({
      where: { shortUrl: shortCode, userId: session.user.id },
      include: {
        clickLogs: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    })

    if (!url) {
      return {
        success: false,
        error: 'URL not found',
      }
    }

    return {
      success: true,
      data: url,
    }
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return {
      success: false,
      error: 'Something went wrong while fetching analytics.',
    }
  }
}
