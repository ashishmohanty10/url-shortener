import { Profile } from '@/components/user/profile'
import { requireAuth } from '@/utils/auth-guard'
import { randomBackgroundGenerator } from '@/utils/random-color'

export default async function ProfilePage() {
  const bg = randomBackgroundGenerator()
  const session = await requireAuth()

  return <Profile session={session} bg={bg} />
}
