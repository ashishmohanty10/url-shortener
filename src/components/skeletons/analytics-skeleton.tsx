import { Card, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function AnalyticsSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-48 " />

      <div className="grid grid-cols-2 items-center gap-x-2 mt-4 mb-5">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      <Skeleton className="h-80 w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-x-5">
        <Card className="w-full card-bg mt-5 h-full">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="w-full h-3 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </Card>

        <Card className="w-full card-bg mt-5 h-full">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="w-full h-3 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
