import { Profile } from '@/components/user/profile'
import { getProfileAnalyticsDataAction } from '@/server/get-profile-analytics-action'
import { requireAuth } from '@/utils/auth-guard'
import { randomBackgroundGenerator } from '@/utils/random-color'

export default async function ProfilePage() {
  const session = await requireAuth()
  const bg = randomBackgroundGenerator()
  const { count, totalClicks } = await getProfileAnalyticsDataAction()

  return <Profile session={session} bg={bg} count={count ?? 0} totalClicks={totalClicks ?? 0} />
}
