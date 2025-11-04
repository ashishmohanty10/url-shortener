import { LinkHeader } from '@/components/links/links-header'
import { requireAuth } from '@/utils/auth-guard'
import { columns } from './columns'
import { URLTable } from './data-table'
import { getData } from '@/server/get-data-action'

export default async function DashboardPage() {
  await requireAuth()
  const data = await getData()

  return (
    <div className="px-2 max-h-screen space-y-5">
      <LinkHeader />
      <URLTable columns={columns} data={data} />
    </div>
  )
}
