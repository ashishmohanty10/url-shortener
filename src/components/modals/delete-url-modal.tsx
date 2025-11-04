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
import { deleteUrl } from '@/server/delete-url-action'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CopyButton } from '../common/copy-button'

export function DeleteUrlModal({ id, password }: { id: string; password: string }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (input.trim() !== `shorten/${password}`) {
      toast.error('Please type the confirmation text exactly as shown.')
      return
    }

    setLoading(true)
    const res = await deleteUrl({ id, password: input.trim() })
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
        <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors duration-75 rounded-sm">
          <Trash2 className="mr-2 h-4 w-4" />
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

          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              To confirm deletion, type{' '}
              <span className="font-semibold text-white/90 cursor-text select-text flex items-center gap-1">
                shorten/{password}
                <CopyButton text={`shorten/${password}`} className="h-4 w-4 mr-1" />
              </span>{' '}
              below
            </div>
            <Input
              placeholder="Type the confirmation text here"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              required
            />
          </div>
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
