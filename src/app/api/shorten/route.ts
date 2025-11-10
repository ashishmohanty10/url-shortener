import { prisma } from '@/lib/prisma'
import { ensureHttps, generateRandomString } from '@/lib/utils'
import { creteLinkSchema } from '@/lib/zod-schema'
import { requireAuth } from '@/utils/auth-guard'
import { invalidateUrlCache } from '@/utils/cache-invalidator'
import { BASE_URL } from '@/utils/constant'
import STATUS_CODES from '@/utils/status-codes'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth()
    const body = await req.json()
    const validateUrl = creteLinkSchema.safeParse(body)

    if (!validateUrl.success) {
      return NextResponse.json(
        {
          success: false,
          error: validateUrl.error.flatten().fieldErrors.originalUrl?.[0] || 'Invalid Url',
        },
        {
          status: STATUS_CODES.BAD_REQUEST,
        }
      )
    }

    const { originalUrl, shortCode, tags } = validateUrl.data
    const correctUrl = ensureHttps(originalUrl)

    const [existingUrl, existingShortCode] = await Promise.all([
      prisma.url.findFirst({
        where: {
          originalUrl: correctUrl,
          userId: user.id,
        },
      }),
      shortCode
        ? prisma.url.findUnique({
            where: { shortUrl: shortCode },
          })
        : null,
    ])

    if (existingUrl) {
      return NextResponse.json(
        { success: false, error: 'You have already shortened this URL' },
        { status: STATUS_CODES.CONFLICT }
      )
    }

    if (existingShortCode) {
      return NextResponse.json(
        { success: false, error: 'This custom short code is already taken' },
        { status: STATUS_CODES.CONFLICT }
      )
    }

    let finalShortCode = shortCode || generateRandomString(8)
    const tagName = tags?.trim().toLowerCase()

    const newUrl = await prisma.url.create({
      data: {
        originalUrl: correctUrl,
        shortUrl: finalShortCode,
        userId: user.id,
        tags: tagName
          ? {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    })

    await invalidateUrlCache(user.id)
    const shortURL = `${BASE_URL}/shorten/${newUrl.shortUrl}`

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUrl.id,
          shortURL,
          originalUrl: correctUrl,
          shortCode: newUrl.shortUrl,
          tags: newUrl.tags.map(tag => tag.name),
          createdAt: newUrl.createdAt,
        },
      },
      { status: STATUS_CODES.CREATED }
    )
  } catch (error) {
    console.error('Failed to shorten URL:', error)

    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Short code already exists' },
        { status: STATUS_CODES.CONFLICT }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to shorten URL' },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }
}
