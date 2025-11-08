import { DailyClick } from '@/utils/types'
import { StatCard } from '../common/profile-stat-card'
import { AnalyticsChart } from './analytics-chart'

interface AnalyticsCardProps {
  count: number
  totalClicks: number
  data: DailyClick[]
}

export async function AnalyticsCard({ count, totalClicks, data }: AnalyticsCardProps) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 items-center gap-x-2 mb-5">
        <StatCard label="Total Shortened URLs" value={count} />
        <StatCard label="Total Clicks" value={totalClicks} />
      </div>

      <AnalyticsChart data={data} />
    </div>
  )
}
