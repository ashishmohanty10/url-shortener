'use server'

import { prisma } from '@/db/prisma'
import { redis } from '@/lib/redis'
import { deleteUrlSchema } from '@/lib/zod-schema'
import { requireAuth } from '@/utils/auth-guard'

export async function deleteUserUrlAction(data: { id: string; password: string }) {
  await requireAuth()

  const parsed = deleteUrlSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    }
  }

  const { id, password } = parsed.data
  try {
    const url = await prisma.url.findUnique({ where: { id } })
    if (!url) {
      return { success: false, error: 'URL not found' }
    }

    if (password !== `shorten/${url.shortUrl}`) {
      return { success: false, error: 'Incorrect confirmation text' }
    }

    await prisma.url.delete({ where: { id } })
    await redis.del(`url:${id}`)

    return { success: true, error: null }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong while deleting URL.',
    }
  }
}
