'use server'

import { prisma } from '@/db/prisma'
import { redis } from '@/lib/redis'
import { requireAuth } from '@/utils/auth-guard'

export async function deleteUrlByAdminAction(id: string) {
  try {
    const { user } = await requireAuth()

    if (user.role !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized!!',
      }
    }

    const existingUrl = await prisma.url.findUnique({
      where: { id },
    })

    if (!existingUrl) {
      return {
        success: false,
        error: 'No such URL found',
      }
    }

    await prisma.url.delete({
      where: { id },
    })

    await redis.del(`admin:urls:*`)
    return {
      success: true,
      message: 'URL deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting URL:', error)
    return {
      success: false,
      error: 'Something went wrong while deleting',
    }
  }
}
