import { cn } from '@/lib/utils'
import React from 'react'

interface PageHeaderType {
  children: React.ReactNode
  className?: string
}

export const PageHeader = ({ children, className }: PageHeaderType) => {
  return <div className={cn('text-lg font-medium', className)}>{children}</div>
}
