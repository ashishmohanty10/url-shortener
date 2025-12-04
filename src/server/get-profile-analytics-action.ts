'use server'

import prisma from '@/db/prisma'
import { requireAuth } from '@/utils/auth-guard'

export async function getProfileAnalyticsDataAction() {
  try {
    const { user } = await requireAuth()
    const urlData = await prisma.url.aggregate({
      _count: { id: true },
      _sum: { clicks: true },
      where: {
        userId: user.id,
      },
    })

    return {
      count: urlData?._count.id ?? 0,
      totalClicks: urlData?._sum.clicks ?? 0,
    }
  } catch (error) {
    console.error('Failed to fetch analytics in profile:', error)
    return {
      success: false,
      error: 'Something went wrong while fetching analytics profile.',
    }
  }
}
