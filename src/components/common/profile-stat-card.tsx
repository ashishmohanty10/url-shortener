import { cn } from '@/lib/utils'
import { StatCardProps } from '@/utils/types'

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center bg-primary-foreground/80 rounded-lg p-4',
        className
      )}
    >
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
