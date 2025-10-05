import { requireAuth } from '@/utils/auth-guard'

export default async function DashboardPage() {
  await requireAuth()
  return <div>Billing</div>
}
