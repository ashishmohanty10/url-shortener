'use client'

import { cn } from '@/lib/utils'
import { SIDEBAR_ITEMS } from '@/utils/constant'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarSkeleton } from '../skeletons/sidebar-skeleton'
import { userPermissionstore } from '@/hooks/user-permission'

export function Sidebar() {
  const pathname = usePathname()
  const { hasPermission, checkPermission, loading } = userPermissionstore()
  useEffect(() => {
    checkPermission()
  }, [])

  if (loading) {
    return <SidebarSkeleton />
  }

  return (
    <nav className="flex flex-col gap-y-5 mt-10 px-2">
      {SIDEBAR_ITEMS.filter(item => item.isPublic || hasPermission).map(item => (
        <Link
          href={item.href}
          key={item.id ?? item.href}
          className={cn(
            'flex items-center gap-x-2 hover:bg-primary-foreground/50 rounded-md py-2 px-4 border border-primary-foreground/10 transition-colors',
            item.href === pathname && 'bg-primary-foreground/50'
          )}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}
