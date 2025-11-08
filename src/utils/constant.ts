import { GitHubIcon, GoogleIcon } from '@/components/auth/o-auth-icons'
import { Feature } from '@/utils/types'
import { Link2, ShieldHalf, User } from 'lucide-react'
import { ComponentProps, ElementType } from 'react'

export const SUPPORTED_OAUTH_PROVIDERS = ['github', 'google'] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const DOMAIN = ''
export const DEFAULT_OG_IMAGE = '/dynamic-og.webp'

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<'svg'>> }
> = {
  google: { name: 'Google', Icon: GoogleIcon },
  github: { name: 'Github', Icon: GitHubIcon },
}

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const SIDEBAR_ITEMS = [
  {
    id: 1,
    name: 'Links',
    href: '/links',
    icon: Link2,
    isPublic: true,
  },
  {
    id: 2,
    name: 'Flagged URLs',
    href: '/flagged',
    icon: ShieldHalf,
    isPublic: false,
  },
  {
    id: 3,
    name: 'Profile',
    href: '/profile',
    icon: User,
    isPublic: true,
  },
]

export const NAVBAR_ITEMS = [
  {
    id: 1,
    name: 'Features',
    href: '#features',
  },
  {
    id: 2,
    name: 'Pricing',
    href: '#pricing',
  },
  {
    id: 3,
    name: 'FAQ',
    href: '#faqs',
  },
]

export const FEATURES_LEFT: Feature[] = [
  {
    title: 'Custom Links & Branding',
    description:
      'Create memorable, on-brand short URLs using custom domains and vanity paths that build trust and increase CTR.',
    image: '/brand.webp',
    alt: 'Custom Links & Branding',
  },
  {
    title: 'Dynamic QR Codes',
    description:
      'Generate customizable QR codes for every link — editable anytime, with built-in tracking.',
    image: '/qr.webp',
    alt: 'Dynamic QR Codes',
  },
  {
    title: 'Smart Link Safety',
    description:
      'Our AI-powered safety engine scans every link in real-time to detect malicious, phishing, or spam URLs.',
    image: '/ai.webp',
    alt: 'Smart Link Safety',
  },
]

export const FEATURES_RIGHT: Feature[] = [
  {
    title: 'Advanced Analytics',
    description:
      'Real-time click analytics, geolocation, referrers, and device breakdowns — turn raw clicks into actionable insights.',
    image: '/analytics.webp',
    alt: 'Advanced Analytics',
  },
  {
    title: 'Smart SEO & OG Proxy',
    description:
      'When you share a branded short link, it automatically shows the original page’s title, description, and preview image — while keeping your own domain for trust and analytics. Perfect for social media sharing and SEO consistency.',
    image: '/seo.webp',
    alt: 'Smart SEO & OG Proxy',
  },
]
