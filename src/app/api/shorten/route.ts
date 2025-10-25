import { prisma } from '@/lib/prisma'
import { ensureHttps, generateRandomString } from '@/lib/utils'
import { creteLinkSchema } from '@/lib/zod-schema'
import { requireAuth } from '@/utils/auth-guard'
import { BASE_URL } from '@/utils/constant'
import STATUS_CODES from '@/utils/status-codes'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await requireAuth()
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

    const existingUrl = await prisma.url.findUnique({
      where: { originalUrl: correctUrl },
    })

    if (existingUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Url already exists',
        },
        { status: STATUS_CODES.CONFLICT }
      )
    }

    const newUrl = await prisma.url.create({
      data: {
        originalUrl: correctUrl,
        shortUrl: shortCode || generateRandomString(8),
        user: {
          connect: { id: session.user.id },
        },
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    })

    const shortURL = `${BASE_URL}/shorten/${newUrl.shortUrl}`

    return NextResponse.json({
      success: true,
      data: { shortURL, origianlUrl: correctUrl, tags: newUrl.tags.map(tag => tag.name) },
    })
  } catch (error) {
    console.error('Failed to shorten URL:', error)
    return NextResponse.json({ success: false, error: 'Failed to shorten URL' }, { status: 500 })
  }
}
