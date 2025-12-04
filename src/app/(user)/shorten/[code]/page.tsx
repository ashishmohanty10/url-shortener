import prisma from '@/db/prisma'
import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { enqueueClickAnalytics, getUrlData } from '@/utils/url-helper'
import { DEFAULT_OG_IMAGE, DOMAIN } from '@/utils/constant'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}): Promise<Metadata> {
  const { code } = await params

  try {
    const url = await prisma.url.findFirst({
      where: { shortUrl: code },
      select: { ogTitle: true, ogDescription: true, ogImage: true },
    })

    if (!url) {
      return {
        title: 'Link not found',
        description: 'The requested short link does not exist.',
        robots: 'noindex, nofollow',
        openGraph: {
          title: 'Link not found',
          description: 'The requested short link does not exist.',
          images: DEFAULT_OG_IMAGE ? [DEFAULT_OG_IMAGE] : undefined,
        },
      }
    }

    return {
      title: url.ogTitle ?? 'Shortened Link',
      description: url.ogDescription ?? 'Link Shortened by using Shorten',
      openGraph: {
        title: url.ogTitle ?? 'Shortened Link',
        description: url.ogDescription ?? 'Link Shortened by using Shorten',
        images: [url.ogImage ?? DEFAULT_OG_IMAGE].filter(Boolean),
        url: `${DOMAIN}/${code}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Link Error',
      description: 'Unable to load this short link. Please try again.',
      robots: 'noindex, nofollow',
    }
  }
}

export default async function LinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  if (!code || typeof code !== 'string') {
    return notFound()
  }

  const urlData = await getUrlData(code)

  if (!urlData?.originalUrl) {
    return notFound()
  }

  const headersList = await headers()
  enqueueClickAnalytics(urlData.id, headersList).catch(err =>
    console.error('Analytics tracking failed:', err)
  )

  return redirect(urlData.originalUrl)
}
