import { AnalyticsProps } from '@/utils/types'
import { StatCard } from '../common/profile-stat-card'
import { AnalyticsChart } from './analytics-chart'
import { ShortLinkAnalyticsCard } from './short-link-analytics-card'
import { ShortLinkInsightsPanel } from './short-link-insight-panel'

export async function Analytics({ data }: { data: AnalyticsProps }) {
  return (
    <div className="mt-4 w-full">
      <div className="grid grid-cols-2 items-center gap-x-2 lg:gap-x-5 mb-5 w-full">
        <StatCard label="Total Shortened URLs" value={data.count} />
        <StatCard label="Total Clicks" value={data.totalClicks} />
      </div>

      <AnalyticsChart data={data.daily} />
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center lg:gap-x-5 mt-5 w-full space-y-5 lg:space-y-0">
        <ShortLinkAnalyticsCard />
        <ShortLinkInsightsPanel />
      </div>
    </div>
  )
}
