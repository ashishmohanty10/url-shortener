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
