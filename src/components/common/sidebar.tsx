'use client'

import { cn } from '@/lib/utils'
import { SIDEBAR_ITEMS } from '@/utils/constant'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarSkeleton } from '../skeletons/sidebar-skeleton'
import { userPermissionStore } from '@/hooks/user-permission'

export function Sidebar() {
  const pathname = usePathname()
  const { hasPermission, checkPermission, loading } = userPermissionStore()
  useEffect(() => {
    checkPermission()
  }, [])

  if (loading) {
    return <SidebarSkeleton />
  }

  return (
    <nav className="flex flex-col gap-y-2 mt-10 px-2">
      {SIDEBAR_ITEMS.filter(item => item.isPublic || hasPermission).map(item => (
        <Link
          href={item.href}
          key={item.id ?? item.href}
          className={cn(
            'flex items-center gap-x-2 hover:bg-card rounded-md py-2 px-4 border border-primary-foreground/10 transition-colors',
            item.href === pathname && 'bg-card'
          )}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}
