import { SIDEBAR_ITEMS } from '@/utils/constant'
import { Skeleton } from '../ui/skeleton'

export function SidebarSkeleton() {
  return (
    <nav className="flex flex-col gap-y-5 mt-10 px-2">
      {SIDEBAR_ITEMS.filter(item => item.isPublic).map((item, i) => (
        <div key={i} className="flex items-center gap-x-2 py-2 px-4 rounded-md">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      ))}
    </nav>
  )
}
