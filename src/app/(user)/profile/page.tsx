import { Profile } from '@/components/user/profile'
import { getProfileAnalyticsData } from '@/server/get-profile-data'
import { requireAuth } from '@/utils/auth-guard'
import { randomBackgroundGenerator } from '@/utils/random-color'

export default async function ProfilePage() {
  const session = await requireAuth()
  const bg = randomBackgroundGenerator()
  const data = await getProfileAnalyticsData()

  return (
    <Profile
      session={session}
      bg={bg}
      count={data.count ?? 0}
      totalClicks={data.totalClicks ?? 0}
    />
  )
}
