import { Skeleton } from '@/components/ui/skeleton'

export function ProfileSkeleton() {
  return (
    <div className="h-full max-h-screen flex flex-col px-8">
      <Skeleton className="h-[20rem] rounded-lg" />

      <div className="px-16">
        <div className="border-b border-neutral-700 flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-4">
            <Skeleton className="size-48 -translate-y-16 rounded-full" />

            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>

          <div className="grid grid-cols-2 items-center gap-x-2">
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-16 w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
