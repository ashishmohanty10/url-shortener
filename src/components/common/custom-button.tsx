import Link from 'next/link'
import { cva, VariantProps } from 'class-variance-authority'
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const buttonClasses = cva('relative inline-flex items-center justify-center', {
  variants: {
    variant: {
      primary:
        'bg-neutral-200 text-black font-medium transition-colors hover:bg-neutral-400 rounded-md text-center',
      secondary:
        'bg-neutral-700 text-white font-medium transition-colors hover:bg-neutral-600 rounded-md text-center',
      destructive:
        'bg-red-700 text-white font-medium transition-colors hover:bg-red-600 rounded-md text-center',
      link: 'text-black font-medium transition-colors hover:text-black/80',
      outline: 'border border-black text-black font-medium transition-colors hover:text-black/80',
      ghost: 'text-primary font-medium transition-colors hover:text-primary/80',
    },
    size: {
      xs: 'text-xs px-2 py-1  leading-none',
      small: 'text-xs px-4 py-[.25rem]  leading-none',
      medium: 'text-sm py-[.7rem] px-4 leading-none',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
})

type ButtonBaseProps = VariantProps<typeof buttonClasses> & {
  children: React.ReactNode
  isLoading?: boolean
}

interface ButtonAsAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

interface ButtonAsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never
}

type ButtonProps = ButtonBaseProps & (ButtonAsAnchorProps | ButtonAsButtonProps)

export const CustomButton = ({ children, variant, size, isLoading, ...props }: ButtonProps) => {
  const classes = buttonClasses({ variant, size, className: props.className })

  if ('href' in props && props.href !== undefined) {
    return (
      <Link {...props} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <Button {...props} className={classes} disabled={isLoading || props.disabled}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
