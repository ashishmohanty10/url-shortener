import { cn } from '@/lib/utils'
import { StatCardProps } from '@/utils/types'

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center bg-card hover:card-bg hover:bg-secondary p-4 rounded-lg',
        className
      )}
    >
      <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">{label}</div>
      <div className="text-lg md:text-2xl font-semibold text-center">{value}</div>
    </div>
  )
}
