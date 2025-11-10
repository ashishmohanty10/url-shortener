import { Analytics } from '@/components/analytics/analytics'
import { PageHeader } from '@/components/common/titles'
import { requireAuth } from '@/utils/auth-guard'

export default async function AnalyticsPage() {
  await requireAuth()

  return (
    <div className="lg:h-[94vh] lg:overflow-y-auto w-full">
      <PageHeader>Analytics</PageHeader>
      <Analytics />
    </div>
  )
}
