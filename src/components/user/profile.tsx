'use client'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { StatCard } from '../common/profile-stat-card'
import { randomBackgroundGenerator } from '@/utils/random-color'
import { SessionType } from '@/utils/types'

export function Profile({ session }: { session: SessionType }) {
  return (
    <div className="h-full max-h-screen flex flex-col px-8">
      <div
        className={`h-[20rem] rounded-lg`}
        style={{ background: randomBackgroundGenerator() }}
      ></div>

      <div className="px-16">
        <div className="border-b border-neutral-750 flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-4">
            <Avatar className="size-48 -translate-y-16">
              <AvatarImage src={session?.user.image || 'https://github.com/shadcn.png'} />
              <AvatarFallback>{session?.user.name?.split(' ')[0].charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold text-2xl mb-2">{session?.user.name}</p>
              <p className="text-base text-foreground">{session?.user.email}</p>
              <p className="text-xs text-foreground/60">
                Member since{' '}
                <span className="font-semibold text-foreground/80">
                  {session?.user.createdAt.toISOString().split('T')[0]}
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-x-2">
            <StatCard label="Total Unique Clicks" value={2000} />
            <StatCard label="Total Clicks" value={10000} />
            <StatCard label="Total Shortened URLs" value={100} />
          </div>
        </div>
      </div>
    </div>
  )
}
