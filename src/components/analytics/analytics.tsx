import { DailyClick } from '@/utils/types'
import { StatCard } from '../common/profile-stat-card'
import { AnalyticsChart } from './analytics-chart'
import { ShortLinkAnalyticsCard } from './short-link-analytics-card'
import { getUrlAnalytics } from '@/server/get-analytics-action'
import { ShortLinkInsightsPanel } from './short-link-insight-panel'

interface AnalyticsProps {
  count: number
  totalClicks: number
  daily: DailyClick[]
}

export async function Analytics() {
  const { count, totalClicks, daily }: AnalyticsProps = await getUrlAnalytics()

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 items-center gap-x-5 mb-5">
        <StatCard label="Total Shortened URLs" value={count} />
        <StatCard label="Total Clicks" value={totalClicks} />
      </div>

      <AnalyticsChart data={daily} />
      <div className="grid grid-cols-2 items-center justify-center gap-x-5 mt-5">
        <ShortLinkAnalyticsCard />
        <ShortLinkInsightsPanel />
      </div>
    </div>
  )
}
