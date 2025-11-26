import { Analytics } from '@/components/analytics/analytics'
import { PageHeader } from '@/components/common/titles'
import { getUrlAnalyticsAction } from '@/server/get-analytics-action'
import { requireAuth } from '@/utils/auth-guard'
import { AnalyticsProps } from '@/utils/types'

export default async function AnalyticsPage() {
  await requireAuth()
  const data: AnalyticsProps = await getUrlAnalyticsAction()

  return (
    <div className="lg:h-[94vh] lg:overflow-y-auto w-full">
      <PageHeader>Analytics</PageHeader>
      <Analytics data={data} />
    </div>
  )
}
