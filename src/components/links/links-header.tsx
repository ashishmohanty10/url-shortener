'use client'

import { PageHeader } from '@/components/common/titles'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Link2 } from 'lucide-react'

export function LinkHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <PageHeader>Links</PageHeader>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center" variant="default">
            <Link2 />
            Create Links
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>Links</DialogHeader>
          <div>Add Links here</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
