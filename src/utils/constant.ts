import { GitHubIcon, GoogleIcon } from '@/components/auth/o-auth-icons'
import { ChartArea, CreditCard, HomeIcon, ShieldHalf, User } from 'lucide-react'
import { ComponentProps, ElementType } from 'react'

export const SUPPORTED_OAUTH_PROVIDERS = ['github', 'google'] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

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
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    isPublic: true,
  },
  {
    id: 2,
    name: 'Stats',
    href: '/stats',
    icon: ChartArea,
    isPublic: true,
  },
  {
    id: 3,
    name: 'Flagged URLs',
    href: '/flagged',
    icon: ShieldHalf,
    isPublic: false,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    isPublic: true,
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
    isPublic: true,
  },
]
