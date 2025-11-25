import { prisma } from '@/db/prisma'
import { ensureHttps, generateRandomString } from '@/lib/utils'
import { creteLinkSchema } from '@/lib/zod-schema'
import { checkUrlSafetyAction } from '@/server/check-url-safety-action'
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
        { status: STATUS_CODES.BAD_REQUEST }
      )
    }

    const { originalUrl, shortCode, tags } = validateUrl.data

    const correctUrl = ensureHttps(originalUrl)

    // Check if THIS user already has this original URL
    const existingUrl = await prisma.url.findFirst({
      where: {
        originalUrl: correctUrl,
        userId: user.id,
      },
    })

    if (existingUrl) {
      return NextResponse.json(
        { success: false, error: 'You have already shortened this URL' },
        { status: STATUS_CODES.CONFLICT }
      )
    }

    // If custom short code provided, check if it exists globally
    if (shortCode) {
      const existingShortCode = await prisma.url.findFirst({
        where: {
          shortUrl: shortCode,
        },
      })

      if (existingShortCode) {
        return NextResponse.json(
          { success: false, error: 'This custom short code is already taken' },
          { status: STATUS_CODES.CONFLICT }
        )
      }
    }

    const safetyCheck = await checkUrlSafetyAction(correctUrl)

    if (!safetyCheck.success) {
      console.error('Safety check failed:', safetyCheck.error)

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to analyze URL safety',
        },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
      )
    }

    const safety = safetyCheck.data
    if (!safety) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to analyze URL safety',
        },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
      )
    }

    const approved = safety.isSafe || false
    const flagged = safety.category !== 'safe'
    const flagReason = safety.reason || ''
    const tagName = tags?.trim()?.toLowerCase()

    // Generate unique short code with retry logic
    let finalShortCode = shortCode
    let attempts = 0
    const maxAttempts = 5

    while (!finalShortCode && attempts < maxAttempts) {
      const candidate = generateRandomString(8)
      const exists = await prisma.url.findFirst({
        where: { shortUrl: candidate },
      })

      if (!exists) {
        finalShortCode = candidate
        break
      }
      attempts++
    }

    if (!finalShortCode) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique short code. Please try again.' },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
      )
    }

    // Create with try-catch for race conditions
    try {
      const newUrl = await prisma.url.create({
        data: {
          originalUrl: correctUrl,
          shortUrl: finalShortCode,
          userId: user.id,

          approved,
          flagged,
          flagReason,

          tags: tagName
            ? {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              }
            : undefined,
        },
        include: { tags: true },
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
            approved,
            flagged,
            flagReason,
            createdAt: newUrl.createdAt,
          },
        },
        { status: STATUS_CODES.CREATED }
      )
    } catch (createError) {
      if (createError instanceof Error && 'code' in createError && createError.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'Short code conflict. Please try again.' },
          { status: STATUS_CODES.CONFLICT }
        )
      }
      throw createError
    }
  } catch (error) {
    console.error('Failed to shorten URL:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to shorten URL' },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }
}
