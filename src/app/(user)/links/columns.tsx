'use client'

import { CopyButton } from '@/components/common/copy-button'
import { DeleteUrlModal } from '@/components/modals/delete-url-modal'
import { QRcodeModal } from '@/components/modals/qr-code-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BASE_URL } from '@/utils/constant'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, MoreHorizontal, MousePointerClick, QrCode } from 'lucide-react'
import Link from 'next/link'

export type URLS = {
  id: string
  // status: 'active' | 'inactive'
  originalUrl: string
  shortUrl: string
  createdAt: Date
  tags: string[]
  clicks: number
}

export const columns: ColumnDef<URLS>[] = [
  {
    accessorKey: 'originalUrl',
    header: 'Original Url',
    cell: ({ row }) => {
      const url = row.original
      return (
        <Link
          className="truncate w-full max-w-[200px] cursor-pointer hover:text-muted-foreground"
          href={url.originalUrl}
          target="_blank"
        >
          {url.originalUrl}
        </Link>
      )
    },
  },
  {
    accessorKey: 'shortUrl',
    header: 'Short Url',
    cell: ({ row }) => {
      const url = row.original
      return (
        <div className="flex items-center gap-2">
          <Link
            className="flex items-center gap-2 cursor-pointer hover:text-muted-foreground"
            href={`${BASE_URL}/shorten/${url.shortUrl}`}
            target="_blank"
          >
            {BASE_URL}/shorten/{url.shortUrl}
          </Link>
          <CopyButton text={`${BASE_URL}/shorten/${url.shortUrl}`} />
        </div>
      )
    },
  },
  {
    accessorKey: 'clicks',
    header: 'Clicks',
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
    cell: ({ row }) => {
      const url = row.original
      return url.tags.length > 0 ? (
        <Badge variant="outline">{url.tags.join(', ')}</Badge>
      ) : (
        <Badge variant="outline">No tags</Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const url = row.original
      return <div className="text-sm">{url.createdAt.toLocaleString()}</div>
    },
  },

  {
    id: 'actions',
    enableHiding: false,
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
            <DropdownMenuItem>
              <Edit />
              Edit
            </DropdownMenuItem>

            <QRcodeModal url={`${BASE_URL}/shorten/${url.shortUrl}`} />

            <DropdownMenuSeparator />
            <DeleteUrlModal id={url.id} password={url.shortUrl} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
