import { Edit } from 'lucide-react'
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

export const ChangeFlagCategoryDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors duration-75 rounded-sm text-sm">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Flag Category</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="default">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
