'use server'

import { prisma } from '@/db/prisma'
import { requireAuth } from '@/utils/auth-guard'
import { AnalyticsItem } from '@/utils/types'

interface AnalyticsResult {
  success?: boolean
  topEight: AnalyticsItem[]
  fullList: AnalyticsItem[]
  error?: string
}

export async function getLast7daysAction(): Promise<AnalyticsResult> {
  try {
    const { user } = await requireAuth()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const urls = await prisma.url.findMany({
      where: {
        userId: user.id,
      },
      select: {
        shortUrl: true,
        clickLogs: {
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true },
        },
      },
    })

    const fullList: AnalyticsItem[] = urls
      .map(u => ({ ...u, clicksCount: u.clickLogs.length }))
      .filter(u => u.clicksCount > 0)
      .sort((a, b) => b.clicksCount - a.clicksCount)

    const topEight = fullList.slice(0, 8)
    return {
      success: true,
      topEight,
      fullList,
    }
  } catch (error) {
    console.error('Failed to fetch last 7 days data', error)
    return {
      success: false,
      error: 'Internal server error',
      topEight: [],
      fullList: [],
    }
  }
}
