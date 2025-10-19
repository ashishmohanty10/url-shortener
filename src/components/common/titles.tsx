import { cn } from '@/lib/utils'
import React from 'react'

interface TitleTypes {
  children: React.ReactNode
  className?: string
}

export const PageHeader = ({ children, className }: TitleTypes) => {
  return <div className={cn('text-lg font-medium', className)}>{children}</div>
}

export const HeroTitle = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance text-foreground/90',
        className
      )}
    >
      {children}
    </div>
  )
}

export const HeroSubTitle = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'scroll-m-20 text-lg font-semibold tracking-tight text-foreground/90',
        className
      )}
    >
      {children}
    </div>
  )
}

export const Paragraph = ({ children, className }: TitleTypes) => {
  return (
    <div className={cn('text-sm font-medium text-foreground/90 text-balance', className)}>
      {children}
    </div>
  )
}

export const Tiles = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'text-sm font-medium border border-neutral-700 card-bg px-4 py-2 rounded-full',
        className
      )}
    >
      {children}
    </div>
  )
}
