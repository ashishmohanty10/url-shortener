'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/utils/auth-guard'

export async function getUrlInsights() {
  try {
    const { user } = await requireAuth()
    const urls = await prisma.url.findMany({
      where: { userId: user.id },
      select: { id: true },
    })

    const urlIds = urls.map(u => u.id)

    if (urlIds.length === 0) {
      return {
        device: {},
        os: {},
        browser: {},
        location: {},
      }
    }
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const clicks = await prisma.urlClick.findMany({
      where: { urlId: { in: urlIds }, createdAt: { gte: sevenDaysAgo } },
      select: {
        device: true,
        os: true,
        browser: true,
        country: true,
        city: true,
      },
    })

    const inc = (obj: Record<string, number>, key?: string | null) => {
      if (!key || key === 'null' || key === 'undefined') return
      obj[key] = (obj[key] || 0) + 1
    }

    const groups = {
      device: {} as Record<string, number>,
      os: {} as Record<string, number>,
      browser: {} as Record<string, number>,
      location: {} as Record<string, number>,
    }

    for (const c of clicks) {
      const parseField = (field: string | null) => {
        if (!field) return null
        if (typeof field === 'string') {
          let cleaned = field.trim()
          if (
            (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
            (cleaned.startsWith("'") && cleaned.endsWith("'"))
          ) {
            cleaned = cleaned.slice(1, -1)
          }
          if (cleaned.startsWith('{')) {
            try {
              return JSON.parse(cleaned)
            } catch {
              return cleaned
            }
          }
          return cleaned
        }
        return field
      }

      // Handle device
      let deviceType = 'Unknown'
      const deviceData = parseField(c.device)
      if (deviceData) {
        if (typeof deviceData === 'string') {
          deviceType = deviceData
        } else if (typeof deviceData === 'object') {
          deviceType = deviceData.type || 'Unknown'
        }
      }
      inc(groups.device, deviceType)

      // Handle OS
      let osName = 'Unknown'
      const osData = parseField(c.os)
      if (osData) {
        if (typeof osData === 'string') {
          osName = osData
        } else if (typeof osData === 'object') {
          osName = osData.name || 'Unknown'
        }
      }
      inc(groups.os, osName)

      let browserName = 'Unknown'
      const browserData = parseField(c.browser)
      if (browserData) {
        if (typeof browserData === 'string') {
          browserName = browserData.split(' ')[0]
        } else if (typeof browserData === 'object') {
          browserName = browserData.name || 'Unknown'
        }
      }
      inc(groups.browser, browserName)
      let locationKey = null
      if (c.city && c.country) {
        locationKey = `${c.city}, ${c.country}`
      } else if (c.country) {
        locationKey = c.country
      } else if (c.city) {
        locationKey = c.city
      }

      inc(groups.location, locationKey)
    }

    const sortByCount = (obj: Record<string, number>) => {
      return Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a))
    }

    // Limit location to top 8
    const sortAndLimit = (obj: Record<string, number>, limit?: number) => {
      const sorted = Object.entries(obj).sort(([, a], [, b]) => b - a)
      const limited = limit ? sorted.slice(0, limit) : sorted
      return Object.fromEntries(limited)
    }

    return {
      device: sortByCount(groups.device),
      os: sortByCount(groups.os),
      browser: sortByCount(groups.browser),
      location: sortAndLimit(groups.location, 8),
    }
  } catch (error) {
    console.error('Failed to fetch grouped insights', error)
    return {
      device: {},
      os: {},
      browser: {},
      location: {},
    }
  }
}
