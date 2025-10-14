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
