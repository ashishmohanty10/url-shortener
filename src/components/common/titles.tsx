import { cn } from '@/lib/utils'
import { TitleTypes } from '@/utils/types'
import React from 'react'

export const PageHeader = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'text-base sm:text-lg md:text-xl font-semibold tracking-tight text-foreground/90',
        className
      )}
    >
      {children}
    </div>
  )
}

export const HeroTitle = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'scroll-m-20 text-center font-extrabold text-balance tracking-tight text-foreground/90 text-2xl sm:text-4xl md:text-4xl lg:text-6xl',
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
        'scroll-m-20 text-center text-balance font-semibold text-foreground/80 text-sm md:text-lg lg:text-xl lg:tracking-tight',
        className
      )}
    >
      {children}
    </div>
  )
}

export const Paragraph = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'text-xs sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-balance',
        className
      )}
    >
      {children}
    </div>
  )
}

export const Tiles = ({ children, className }: TitleTypes) => {
  return (
    <div
      className={cn(
        'inline-block rounded-full border border-neutral-700 bg-neutral-900/30 px-3 py-1 text-[10px] sm:text-xs md:text-sm font-medium text-foreground/90',
        className
      )}
    >
      {children}
    </div>
  )
}
