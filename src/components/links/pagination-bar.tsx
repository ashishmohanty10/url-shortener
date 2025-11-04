'use client'

import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

export function PaginationBar({ table }: { table: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-4 left-1/2
           flex items-center justify-between
           w-full max-w-3xl
           bg-neutral-900/80 backdrop-blur-md border border-neutral-800
           rounded-xl shadow-lg px-5 py-3 z-50"
      style={{
        transformOrigin: 'center center',
        x: '-50%',
      }}
    >
      {/* Page Info */}
      <div className="text-sm text-neutral-300">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div>

      {/* Controls */}
      <div className="space-x-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </motion.div>
  )
}
