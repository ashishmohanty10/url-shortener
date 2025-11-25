'use client'

import { CopyButton } from '@/components/common/copy-button'
import { DeleteUrlModal } from '@/components/modals/delete-url-modal'
import { QRcodeModal } from '@/components/modals/qr-code-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BASE_URL } from '@/utils/constant'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { FlagReasonDialog } from '@/components/modals/flag-reason-dialog'
import { UserUrlType } from '@/utils/types'

export const columns: ColumnDef<UserUrlType>[] = [
  {
    accessorKey: 'originalUrl',
    header: 'Original Url',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original
      return (
        <Link className="" href={url.originalUrl} target="_blank">
          <span className="block truncate w-60 cursor-pointer hover:text-muted-foreground">
            {url.originalUrl}
          </span>
        </Link>
      )
    },
  },
  {
    accessorKey: 'shortUrl',
    header: 'Short Url',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original
      console.log('url.flagCategory', url.flagCategory)
      return (
        <div key={url.id} className="w-full">
          {!url.approved ? (
            <div className="flex items-center gap-x-4 w-full h-full">
              <div className="truncate overflow-x-hidden h-fit w-60 text-2xl font-semibold tracking-tight leading-none flex items-center gap-x-1">
                {Array.from(
                  { length: `${BASE_URL}/shorten/${url.shortUrl}`.length },
                  (_, i) => i
                ).map((_, index) => (
                  <div key={index} className="size-4">
                    *
                  </div>
                ))}
              </div>
              <FlagReasonDialog
                flagCategory={url.flagCategory || 'safe'}
                flagReason={url.flagReason || 'No reason provided'}
                showUserMsg={true}
              />
            </div>
          ) : (
            <div className="flex items-center gap-x-4">
              <Link
                className="cursor-pointer hover:text-muted-foreground w-60 truncate whitespace-nowrap overflow-hidden text-ellipsis"
                href={`${BASE_URL}/shorten/${url.shortUrl}`}
                target="_blank"
              >
                {BASE_URL}/shorten/{url.shortUrl}
              </Link>
              <CopyButton text={`${BASE_URL}/shorten/${url.shortUrl}`} />
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'clicks',
    header: 'Clicks',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original
      return (
        <Badge
          title={`${url.clicks} clicks`}
          variant="outline"
          className="grid grid-cols-2 items-center gap-1 px-2 py-0.5 min-w-[60px] max-w-[80px] justify-between"
        >
          <span className="text-sm font-medium truncate justify-self-start">
            {Intl.NumberFormat('en', { notation: 'compact' }).format(url.clicks)}
          </span>
          <MousePointerClick className="h-4 w-4 opacity-80 justify-self-end" />
        </Badge>
      )
    },
  },

  {
    accessorKey: 'tags',
    header: 'Tags',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original
      return url.tags?.length > 0 ? (
        <Badge variant="success">{url.tags.join(', ')}</Badge>
      ) : (
        <Badge variant="outline">No tags</Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const url = row.original
      return (
        <div className="text-sm">
          {new Date(url.createdAt).toLocaleString('en-US', { hour12: true })}
        </div>
      )
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    enableSorting: true,
    cell: ({ row }) => {
      const url = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <QRcodeModal url={`${BASE_URL}/shorten/${url.shortUrl}`} />

            <DropdownMenuSeparator />
            <DeleteUrlModal id={url.id} password={url.shortUrl} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
