'use client'

import { Edit } from 'lucide-react'
import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { toast } from 'sonner' // Or your toast library
import { Loader2 } from 'lucide-react'
import { changeFlagCategoryAction } from '@/server/admin/change-flag-categoy'
import { correctTextColor } from '@/lib/utils'

interface ChangeFlagCategoryDialogProps {
  urlId: string
  currentCategory: string
}

export const ChangeFlagCategoryDialog = ({
  urlId,
  currentCategory,
}: ChangeFlagCategoryDialogProps) => {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory.toUpperCase())
  const [isPending, startTransition] = useTransition()

  const handleConfirm = () => {
    setOpen(true)
    startTransition(async () => {
      const result = await changeFlagCategoryAction(urlId, selectedCategory)

      if (result.success) {
        setOpen(false)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors duration-75 rounded-sm text-sm">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-5">
          <DialogTitle>Change Flag Category</DialogTitle>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Current category:{' '}
              <span
                className="font-semibold uppercase"
                style={{ color: correctTextColor(currentCategory) }}
              >
                {currentCategory}
              </span>
            </p>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Flag Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Flag Categories</SelectLabel>
                  <SelectItem value="SAFE">Safe</SelectItem>
                  <SelectItem value="SUSPICIOUS">Suspicious</SelectItem>
                  <SelectItem value="MALICIOUS">Malicious</SelectItem>
                  <SelectItem value="INAPPROPRIATE">Inappropriate</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="default" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
