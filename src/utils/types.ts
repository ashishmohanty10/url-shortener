export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export type StatCardProps = {
  label: string
  value: number | string
  className?: string
}

export interface UserPermissionStoreState {
  hasPermission: boolean
  loading: boolean
  checkPermission: () => void
}

export interface TitleTypes {
  children: React.ReactNode
  className?: string
}

export interface Feature {
  title: string
  description: string
  image: string
  alt: string
}

export interface UrlData {
  id: string
  originalUrl: string
}

export interface DailyClick {
  date: string
  clicks: number
}

interface AnalyticsChartData {
  date: string
  clicks: number
}

export interface AnalyticsChartProps {
  data: AnalyticsChartData[]
}

export interface AnalyticsItem {
  shortUrl: string
  clickLogs: { createdAt: Date }[]
  clicksCount: number
}

export interface AnalyticsProps {
  count: number
  totalClicks: number
  daily: DailyClick[]
}

export type UserUrlType = {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: Date
  clicks: number
  tags: string[]
  flagged: boolean
  approved: boolean
  flagReason: string
  flagCategory: string
}

export type AdminUrlType = {
  id: string
  originalUrl: string
  shortUrl: string
  clicks: number
  createdAt: Date
  updatedAt?: Date
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  flagged: boolean
  approved: boolean
  flagReason: string
  flagCategory: string
  userId?: string
  user: {
    id: string
    email: string
    image?: string | null
    name: string | null
  }
  tags: string[]
}
