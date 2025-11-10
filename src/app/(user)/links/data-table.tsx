'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { PaginationBar } from '@/components/links/pagination-bar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Funnel } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  currentPage: number
  initialFilter: string
}

export function URLTable<TData, TValue>({
  columns,
  data,
  totalPages,
  currentPage,
  initialFilter,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sorting, setSorting] = useState<SortingState>([])
  const [filter, setFilter] = useState(initialFilter)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      params.set('page', '1')
      if (filter) params.set('filter', filter)
      else params.delete('filter')
      router.push(`?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timeout)
  }, [filter])

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    if (filter) params.set('filter', filter)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Filter Input */}
      <div className="flex justify-between items-center mb-10 gap-x-2 md:gap-x-0">
        <Input
          placeholder="Search URLs..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className={cn(
            'w-full rounded-md border border-neutral-700 transition-colors max-w-sm',
            'focus:border-neutral-500 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200',
            'placeholder:text-neutral-300'
          )}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Column
              <Funnel />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden max-h-[70vh] rounded-md border border-border grid grid-cols-1">
        <Table>
          <TableHeader className="sticky top-0 bg-neutral-900 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {data.length ? (
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
