import { cn } from '@/lib/utils'
import React from 'react'

interface TitleTypes {
  children: React.ReactNode
  className?: string
}

interface FeatureCardTypes {
  children: React.ReactNode
  className?: string
}

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
        'scroll-m-20 text-center font-extrabold text-balance tracking-tight text-foreground/90 text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
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
        'scroll-m-20 text-center text-balance font-semibold text-foreground/80 text-sm md:text-lg lg:tracking-tight',
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
        'text-xs sm:text-base md:text-lg font-medium leading-relaxed text-balance',
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

export const FeatureCard = ({ children, className }: FeatureCardTypes) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-800 w-full relative overflow-hidden bg-neutral-900/30',
        className
      )}
    >
      <div className="absolute bottom-0 -left-10 -z-10 w-44 h-48 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0072E5_70%)] blur-md rotate-45 animate-gradient-wave"></div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}
