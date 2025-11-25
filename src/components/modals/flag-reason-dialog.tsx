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
        <Button
          size="sm"
          className="text-center"
          style={{ backgroundColor: correctTextColor(flagCategory.toLowerCase()) }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'text-white font-semibold w-24 text-center',
                    showUserMsg && 'w-fit'
                  )}
                >
                  {!showUserMsg && <div className="text-xs text-center">{flagCategory}</div>}
                  {showUserMsg ? (
                    <div className="col-span-1">
                      <BadgeInfo size={8} />
                    </div>
                  ) : null}
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
