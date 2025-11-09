import { getLast7days } from '@/server/get-last-7days-action'
import { Card, CardHeader, CardTitle } from '../ui/card'
import AnalyticsDialogList from '../modals/analytics-dialog'
import Link from 'next/link'
import { BASE_URL } from '@/utils/constant'
import { CopyButton } from '../common/copy-button'

export async function ShortLinkAnalyticsCard() {
  const { fullList, topEight } = await getLast7days()
  const maxClicks = Math.max(...topEight.map(item => item.clickLogs.length), 1)
  return (
    <Card className="w-full hover:card-bg overflow-auto relative">
      <CardHeader>
        <CardTitle>Short Links Analytics</CardTitle>
      </CardHeader>

      <div className="p-6 pt-0">
        {topEight.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No short links activity in last 7 days
          </p>
        ) : (
          <div className="space-y-4">
            {topEight.map(item => {
              const clicks = item.clickLogs.length
              const percentage = (clicks / maxClicks) * 100

              return (
                <div key={item.shortUrl} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        className="flex items-center gap-2 cursor-pointer hover:text-muted-foreground"
                        href={`${BASE_URL}/shorten/${item.shortUrl}`}
                        target="_blank"
                      >
                        {BASE_URL}/shorten/{item.shortUrl}
                      </Link>
                      <CopyButton text={`${BASE_URL}/shorten/${item.shortUrl}`} />
                    </div>
                    <span className="text-muted-foreground">{clicks} clicks</span>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3 transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center py-4">
        <AnalyticsDialogList fullList={fullList} />
      </div>
    </Card>
  )
}
