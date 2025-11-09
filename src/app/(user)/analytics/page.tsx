import { Analytics } from '@/components/analytics/analytics'
import { PageHeader } from '@/components/common/titles'
import { requireAuth } from '@/utils/auth-guard'

export default async function AnalyticsPage() {
  await requireAuth()

  return (
    <div className="h-[95vh] overflow-y-auto">
      <PageHeader>Analytics</PageHeader>
      <Analytics />
    </div>
  )
}
