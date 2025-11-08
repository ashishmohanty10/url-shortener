import { AnalyticsCard } from '@/components/analytics/analytics-card'
import { PageHeader } from '@/components/common/titles'
import { getUrlAnalytics } from '@/server/get-analytics-action'

export default async function AnalyticsPage() {
  const { count, totalClicks, daily } = await getUrlAnalytics()

  return (
    <div>
      <PageHeader>Analytics</PageHeader>
      <AnalyticsCard count={count ?? 0} totalClicks={totalClicks ?? 0} data={daily || []} />
    </div>
  )
}
