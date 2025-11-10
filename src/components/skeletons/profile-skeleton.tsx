import { Skeleton } from '../ui/skeleton'

export function ProfileSkeleton() {
  return (
    <div className="h-full flex flex-col w-full">
      <Skeleton className="h-[14rem] w-full rounded-lg" />

      <div className="lg:px-16">
        <div className="lg:border-b border-neutral-750 lg:flex items-center justify-between gap-x-4">
          <div className="flex items-center justify-center lg:justify-start gap-x-4">
            <div className="relative -translate-y-16">
              <Skeleton className="size-48 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 items-center gap-x-2">
            <Skeleton className="h-20 w-40 rounded-lg" />
            <Skeleton className="h-20 w-40 rounded-lg" />
          </div>
        </div>

        <div className="mt-12">
          <div className="rounded-lg p-4 space-y-5 border border-neutral-750">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-48" />
            </div>

            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-64" />
            </div>

            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="mt-4">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
