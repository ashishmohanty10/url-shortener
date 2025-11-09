import { Profile } from '@/components/user/profile'
import { getProfileAnalyticsData } from '@/server/get-url-data-action'
import { requireAuth } from '@/utils/auth-guard'
import { randomBackgroundGenerator } from '@/utils/random-color'

export default async function ProfilePage() {
  const session = await requireAuth()
  const bg = randomBackgroundGenerator()
  const { count, totalClicks } = await getProfileAnalyticsData()

  return <Profile session={session} bg={bg} count={count ?? 0} totalClicks={totalClicks ?? 0} />
}
