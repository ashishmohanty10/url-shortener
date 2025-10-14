'use server'

import { prisma } from '@/db'
import { urlSchema } from '@/lib/zod-schema'
import { nanoid } from 'nanoid'
import { BASE_URL } from '@/utils/constant'
import { revalidatePath } from 'next/cache'
import { ensureHttps } from '@/lib/utils'
import { requireAuth } from '@/utils/auth-guard'

export const shortenURLAction = async (formData: FormData) => {
  const session = await requireAuth()

  try {
    const data = formData.get('url') as string
    const validateUrl = urlSchema.safeParse({ url: data })

    if (!validateUrl.success) {
      return {
        success: false,
        error: validateUrl.error.flatten().fieldErrors.url?.[0] || 'Invalid URL',
      }
    }

    const { url } = validateUrl.data
    const correctUrl = ensureHttps(url)

    const existingUrl = await prisma.url.findUnique({
      where: {
        originalUrl: correctUrl,
      },
    })

    if (existingUrl) {
      return {
        success: false,
        error: 'URL already exists',
      }
    }

    const shortCode = nanoid(8)
    const createUrl = await prisma.url.create({
      data: {
        originalUrl: correctUrl,
        shortUrl: shortCode,
        user: {
          connect: { id: session.user.id },
        },
      },
    })
    const shortURL = `${BASE_URL}/${createUrl.shortUrl}`
    revalidatePath('/links')

    return {
      success: true,
      data: {
        shortURL,
      },
    }
  } catch (error) {
    console.error('Failed to shorten URL', error)
    return {
      success: false,
      error: 'Failed to shorten URL',
    }
  }
}
