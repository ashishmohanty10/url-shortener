'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/utils/auth-guard'
import { fillMissingDays } from '@/utils/analytics-chart-helper'

export async function getUrlAnalytics() {
  const { user } = await requireAuth()

  try {
    const totals = await prisma.url.aggregate({
      where: { userId: user.id },
      _count: { id: true },
      _sum: { clicks: true },
    })

    // Get all clicks with just the createdAt field
    const allClicks = await prisma.urlClick.findMany({
      where: {
        url: { userId: user.id },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group by day
    const dailyMap = new Map()

    allClicks.forEach(click => {
      const date = click.createdAt.toISOString().split('T')[0] // YYYY-MM-DD
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
    })

    // Convert to array and sort
    const daily = Array.from(dailyMap, ([date, clicks]) => ({
      date,
      clicks,
    })).sort((a, b) => a.date.localeCompare(b.date))

    const fullDaily = fillMissingDays(daily, 365)

    console.log('Analytics Data:', {
      totalUrls: totals._count.id,
      totalClicks: totals._sum.clicks,
      dailyRecords: fullDaily.length,
      daysWithClicks: daily.length,
      totalDailyClicks: fullDaily.reduce((sum, day) => sum + day.clicks, 0),
    })

    return {
      success: true,
      count: totals._count.id,
      totalClicks: totals._sum.clicks ?? 0,
      daily: fullDaily,
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return {
      success: false,
      error: 'Something went wrong while fetching analytics.',
      count: 0,
      totalClicks: 0,
      daily: [],
    }
  }
}
