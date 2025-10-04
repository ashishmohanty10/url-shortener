import { Skeleton } from '../ui/skeleton'

export function ButtonSkeleton() {
  return (
    <div className="w-full grid grid-cols-3 items-center bg-primary-foreground/70 py-2 px-3 rounded-lg">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="col-span-2 flex flex-col gap-y-1 ml-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}
