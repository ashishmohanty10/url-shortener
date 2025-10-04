'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenu, DropdownMenuContent } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { authClient } from '@/lib/auth-client'
import { Button } from '../ui/button'
import { ButtonSkeleton } from '../skeletons/button-skeleton'

export function UserButton() {
  const { data: session, isPending } = authClient.useSession()
  const handleLogout = async () => {
    await authClient.signOut()
  }

  if (isPending) {
    return <ButtonSkeleton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full grid grid-cols-3 items-center bg-primary-foreground/70 py-2 px-3 rounded-lg hover:bg-primary-foreground/50 cursor-pointer transition-colors">
          <Avatar>
            <AvatarImage src={session?.user.image || 'https://github.com/shadcn.png'} />
            <AvatarFallback>{session?.user.name?.split(' ')[0].charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="col-span-2 flex flex-col">
            <span className="font-medium">{session?.user.name}</span>
            <span className="text-xs text-muted-foreground">{session?.user.email}</span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
