import { BadgeInfo } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { cn, correctTextColor } from '@/lib/utils'

export const FlagReasonDialog = ({
  flagReason,
  flagCategory,
  showUserMsg,
}: {
  flagCategory: string
  flagReason: string
  showUserMsg?: boolean
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" style={{ backgroundColor: correctTextColor(flagCategory.toLowerCase()) }}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'flex items-center justify-between gap-x-3 text-white font-semibold w-24',
                    showUserMsg && 'w-fit'
                  )}
                >
                  {!showUserMsg && <div className="text-xs">{flagCategory}</div>}
                  <div className="col-span-1">
                    <BadgeInfo size={8} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>View Flag Reason</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag Reason</DialogTitle>
          {!showUserMsg ? (
            <DialogDescription className="text-xs flex items-center space-x-2">
              <span>CATEGORY:</span>{' '}
              <div style={{ color: correctTextColor(flagCategory.toLocaleLowerCase()) }}>
                {flagCategory}
              </div>
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <DialogDescription>
          {showUserMsg
            ? 'This is flagged and will be reviewed by our team. Once approved, you will be able to access it.'
            : flagReason}
        </DialogDescription>

        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
