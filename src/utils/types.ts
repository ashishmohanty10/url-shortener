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

export interface SessionType {
  session: {
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    expiresAt: Date
    token: string
    ipAddress?: string | null | undefined | undefined
    userAgent?: string | null | undefined | undefined
    impersonatedBy?: string | null | undefined
  }
  user: {
    id: string
    createdAt: Date
    updatedAt: Date
    email: string
    emailVerified: boolean
    name: string
    image?: string | null | undefined | undefined
    banned: boolean | null | undefined
    role?: string | null | undefined
    banReason?: string | null | undefined
    banExpires?: Date | null | undefined
  }
}
