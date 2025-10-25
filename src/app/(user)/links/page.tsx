import { LinkHeader } from '@/components/links/links-header'
import { requireAuth } from '@/utils/auth-guard'

export default async function DashboardPage() {
  await requireAuth()
  return (
    <div className="px-2 max-h-screen">
      <LinkHeader />
    </div>
  )
}
