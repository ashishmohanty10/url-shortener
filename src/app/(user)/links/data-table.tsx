'use client'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { PaginationBar } from '@/components/links/pagination-bar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  currentPage: number
}

export function URLTable<TData, TValue>({
  columns,
  data,
  totalPages,
  currentPage,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const goToPage = (page: number) => {
    router.push(`?page=${page}`)
  }

  return (
    <div className="space-y-4">
      {/* Filter Input */}
      <div className="flex justify-between items-center mb-10">
        <Input
          placeholder="Filter URLs..."
          value={(table.getColumn('originalUrl')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('originalUrl')?.setFilterValue(event.target.value)}
          className={cn(
            'w-full rounded-md border border-neutral-700 transition-colors max-w-sm',
            'focus:border-neutral-500 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200',
            'placeholder:text-neutral-300'
          )}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-y-auto max-h-[70vh] rounded-md border border-border">
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-neutral-900 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center select-none">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <PaginationBar
        table={{
          getState: () => ({ pagination: { pageIndex: currentPage - 1 } }),
          getPageCount: () => totalPages,
          previousPage: () => goToPage(currentPage - 1),
          nextPage: () => goToPage(currentPage + 1),
          getCanPreviousPage: () => currentPage > 1,
          getCanNextPage: () => currentPage < totalPages,
        }}
      />
    </div>
  )
}
