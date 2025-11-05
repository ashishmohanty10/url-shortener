import { Skeleton } from '@/components/ui/skeleton'

export default function LinksSkeleton() {
  return (
    <div className="px-2 max-h-screen space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Filter Input Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="w-full overflow-y-auto max-h-[70vh] rounded-md border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0 bg-neutral-900">
              {[...Array(5)].map((_, i) => (
                <th key={i} className="p-3 text-left">
                  <Skeleton className="h-4 w-24 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-t border-border">
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="p-3">
                    <Skeleton className="h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-8 w-24 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  )
}
