import { DailyClick } from '@/utils/types'
import { StatCard } from '../common/profile-stat-card'
import { AnalyticsChart } from './analytics-chart'
import { ShortLinkAnalyticsCard } from './short-link-analytics-card'
import { getUrlAnalyticsAction } from '@/server/get-analytics-action'
import { ShortLinkInsightsPanel } from './short-link-insight-panel'

interface AnalyticsProps {
  count: number
  totalClicks: number
  daily: DailyClick[]
}

export async function Analytics() {
  const { count, totalClicks, daily }: AnalyticsProps = await getUrlAnalyticsAction()

  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-2 items-center gap-x-2 lg:gap-x-5 mb-5 w-full">
        <StatCard label="Total Shortened URLs" value={count} />
        <StatCard label="Total Clicks" value={totalClicks} />
      </div>

      <AnalyticsChart data={daily} />
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center lg:gap-x-5 mt-5 w-full space-y-5 lg:space-y-0">
        <ShortLinkAnalyticsCard />
        <ShortLinkInsightsPanel />
      </div>
    </div>
  )
}
