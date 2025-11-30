'use client'

import { DeleteUrlByAdmin } from '@/components/admin/delete-url-by-admin'
import { CopyButton } from '@/components/common/copy-button'
import { QRcodeModal } from '@/components/modals/qr-code-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { ChangeFlagCategoryDialog } from '@/components/modals/change-flag-category-dialog'
import { AdminUrlType } from '@/utils/types'

export const flaggedColumns: ColumnDef<AdminUrlType>[] = [
  {
    accessorKey: 'user',
    header: 'Created By',
    cell: ({ row }) => {
      const { user } = row.original
      return (
        <div className="flex items-center gap-x-3">
          <Avatar>
            <AvatarImage src={user.image || user.name?.split(' ')[0].charAt(0)} />
            <AvatarFallback>{user.name?.split(' ')[0].charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-xs md:text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'originalUrl',
    header: 'Original Url',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original
      return (
        <Link href={url.originalUrl} target="_blank">
          <span className="block truncate w-60 cursor-pointer hover:text-muted-foreground text-xs md:text-sm">
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
      return (
        <div className="flex items-center gap-2">
          <Link
            className="cursor-pointer hover:text-muted-foreground w-60 truncate whitespace-nowrap overflow-hidden text-ellipsis text-xs md:text-sm"
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
    accessorKey: 'flagCategory',
    header: 'Flag Category',
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.original
      return (
        <div className="flex items-center gap-x-2">
          <FlagReasonDialog
            flagReason={url.flagReason}
            flagCategory={url.flagCategory.toUpperCase()}
          />
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
          <span className="font-medium truncate justify-self-start text-xs md:text-sm">
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
        <Badge
          variant="success"
          className="text-xs md:text-sm bg-green-500/10 hover:bg-green-500 group  transition-colors cursor-pointer"
        >
          <span className="text-green-400 group-hover:text-white transition-colors">
            {url.tags.join(', ')}
          </span>
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="text-xs md:text-sm text-green-400 hover:bg-green-500 hover:text-white transition-colors"
        >
          NoTags
        </Badge>
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
        <div className="text-xs md:text-sm">
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
            <ChangeFlagCategoryDialog urlId={url.id} currentCategory={url.flagCategory} />
            <QRcodeModal url={`${BASE_URL}/shorten/${url.shortUrl}`} />

            <DropdownMenuSeparator />
            <DeleteUrlByAdmin id={url.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
