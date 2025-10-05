import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// should only be use in server component
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/signin')
  return session
}

export async function requireGuest() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')
  return null
}
