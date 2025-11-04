'use client'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy text')
    }
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleCopy}
      className={cn('p-0 h-4 w-4', className)}
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 hover:text-gray-400 duration-75 transition-colors" />
      )}
    </Button>
  )
}
