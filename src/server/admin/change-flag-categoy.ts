'use server'

import { requireAuth } from '@/utils/auth-guard'
import { Url } from '../../../prisma/generated/prisma'
import { prisma } from '@/db/prisma'

export async function changeFlagCategorieAction(url: Url) {
  const { user } = await requireAuth()
  const role = user.role
  if (role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.url.update({
      where: {
        id: url.id,
      },
      data: {
        flagCategory: url.flagCategory,
        flagReason: '',
      },
    })
    return {
      success: true,
      message: 'Flag category updated successfully',
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Something went wrong',
    }
  }
}
