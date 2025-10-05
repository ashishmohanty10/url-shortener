import { Profile } from '@/components/user/profile'
import { requireAuth } from '@/utils/auth-guard'

export default async function ProfilePage() {
  const session = await requireAuth()

  return <Profile session={session} />
}
