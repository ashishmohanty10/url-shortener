'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { authClient } from '@/lib/auth-client'
import { ButtonSkeleton } from '../skeletons/button-skeleton'
import { LogoutButton } from '../common/logout-button'

export function UserButton() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <ButtonSkeleton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full grid grid-cols-3 items-center card-bg p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
          <Avatar>
            <AvatarImage src={session?.user.image || session?.user.name?.split(' ')[0].charAt(0)} />
            <AvatarFallback>{session?.user.name?.split(' ')[0].charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="col-span-2 flex flex-col">
            <span className="font-medium truncate block">{session?.user.name}</span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>
          <div className="flex flex-col">
            <span className="font-medium">{session?.user.name}</span>
            <span className="text-xs text-muted-foreground">{session?.user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton className="w-full" variant="destructive" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
