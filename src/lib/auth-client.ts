import { createAuthClient } from 'better-auth/react'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { nextCookies } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

export const authClient = createAuthClient({
  plugins: [adminClient(), nextCookies(), inferAdditionalFields<typeof auth>()],
})
