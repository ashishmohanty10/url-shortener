import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AnalyticsItem } from '@/utils/types'
import Link from 'next/link'
import { BASE_URL } from '@/utils/constant'
import { CopyButton } from '../common/copy-button'

interface AnalyticsDialogListProps {
  fullList: AnalyticsItem[]
}

export default function AnalyticsDialogList({ fullList }: AnalyticsDialogListProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">View More</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70%] overflow-y-auto max-w-xs md:max-w-lg lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Last 7 Days Clicks</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fullList.map(item => {
            const clicks = item.clickLogs.length

            return (
              <div key={item.shortUrl} className="space-y-1">
                <div className="md:flex justify-between text-xs lg:text-base mb-2 md:mb-0">
                  <div className="flex items-center gap-x-3">
                    <Link
                      className="flex items-center gap-2 cursor-pointer hover:text-muted-foreground"
                      href={`${BASE_URL}/shorten/${item.shortUrl}`}
                      target="_blank"
                    >
                      {BASE_URL}/shorten/{item.shortUrl}
                    </Link>
                    <CopyButton text={`${BASE_URL}/shorten/${item.shortUrl}`} />
                  </div>
                  <div className="text-muted-foreground">{clicks} clicks</div>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
