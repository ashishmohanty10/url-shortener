'use client'

import { CustomButton } from './custom-button'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'destructive' | 'link' | 'outline' | 'ghost'
}

export function LogoutButton({ className, variant }: LogoutButtonProps) {
  const router = useRouter()
  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/signin')
  }
  return (
    <CustomButton onClick={handleLogout} className={cn(className)} variant={variant}>
      Logout
    </CustomButton>
  )
}
