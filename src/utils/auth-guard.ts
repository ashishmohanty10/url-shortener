import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

// should only be use in server component
export const requireAuth = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/signin')
  }
  return session
})

export const requireGuest = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/links')
  return null
})
