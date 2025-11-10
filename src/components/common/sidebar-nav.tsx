'use client'

import { UserButton } from '../user/user-button'
import { SidebarItems } from './sidebar-items'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import Logo from '../icon/logo'
import Link from 'next/link'

export const DesktopNav = () => {
  return (
    <div className="p-2 hidden xl:block">
      <div className="p-2 w-full h-full bg-gradient-to-br from-secondary/80 to-secondary/20 rounded-lg">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col h-full">
            <Link
              href="/links"
              className="flex items-center justify-center gap-x-4 py-4 group cursor-pointer"
            >
              <Logo className="size-7 leading-none group-hover:animate-spin" />

              <div className="text-2xl font-bold leading-none">ShortenURL</div>
            </Link>

            <SidebarItems />
          </div>
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export const MobileNav = () => {
  return (
    <div className="mb-5 xl:hidden flex items-center justify-between w-full">
      <Link href="/links" className="flex items-center justify-center gap-x-2 ">
        <Logo className="size-5 leading-none fill-none" />
        <div className="text-lg font-bold leading-none">ShortenURL</div>
      </Link>

      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <div className="w-full h-full">
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col h-full">
                  <Link href="/links" className="flex items-center justify-center gap-x-2">
                    <Logo className="size-5 leading-none fill-none" />

                    <div className="text-lg font-bold leading-none">ShortenURL</div>
                  </Link>

                  <SidebarItems />
                </div>
                <UserButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
