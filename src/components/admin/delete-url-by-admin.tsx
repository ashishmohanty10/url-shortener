'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { deleteUrlByAdminAction } from '@/server/admin/delete-url-by-admin'

export function DeleteUrlByAdmin({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const res = await deleteUrlByAdminAction(id)
    setLoading(false)

    if (!res.success) {
      toast.error(res.error || 'Something went wrong while deleting the URL.')
      return
    }

    toast.success('URL deleted successfully!')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors duration-75 rounded-sm text-sm">
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete URL</DialogTitle>
          <Separator />
          <DialogDescription className="mb-5">
            <span className="mb-2 block">Are you sure you want to delete this link?</span>
            <span className="mb-4 block text-sm text-muted-foreground">
              This action cannot be undone. Deleting this link will also remove all analytics data.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
