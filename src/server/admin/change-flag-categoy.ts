'use server'

import { requireAuth } from '@/utils/auth-guard'
import prisma from '@/db/prisma'
import { revalidatePath } from 'next/cache'
import { invalidateUrlCache } from '@/utils/cache-invalidator'
import { FlagCategory } from '../../../prisma/generated/prisma/enums'

export async function changeFlagCategoryAction(urlId: string, flagCategory: string) {
  try {
    const { user } = await requireAuth()

    if (user.role !== 'admin') {
      return {
        success: false,
        message: 'Unauthorized: Admin access required',
      }
    }

    const normalizedCategory = flagCategory.toLowerCase() as FlagCategory
    if (!Object.values(FlagCategory).includes(normalizedCategory)) {
      return {
        success: false,
        message: 'Invalid flag category',
      }
    }

    const isSafe = normalizedCategory === FlagCategory.safe

    const url = await prisma.url.findUnique({
      where: { id: urlId },
      select: { userId: true },
    })

    if (!url) {
      return {
        success: false,
        message: 'URL not found',
      }
    }

    await prisma.url.update({
      where: {
        id: urlId,
      },
      data: {
        flagCategory: normalizedCategory,
        approved: isSafe,
        flagged: !isSafe,
        flagReason: isSafe ? '' : undefined,
      },
    })

    await invalidateUrlCache(url.userId)

    revalidatePath('/flagged')

    return {
      success: true,
      message: `URL marked as ${normalizedCategory.toLowerCase()} successfully`,
    }
  } catch (error) {
    console.error('Error updating flag category:', error)
    return {
      success: false,
      message: 'Something went wrong while updating flag category',
    }
  }
}
