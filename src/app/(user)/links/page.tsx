import { LinkHeader } from '@/components/links/links-header'
import { getData } from '@/server/get-data-action'
import { requireAuth } from '@/utils/auth-guard'
import { URLTable } from './data-table'
import { columns } from './columns'

export default async function DashboardPage(props: { searchParams: Promise<{ page?: string }> }) {
  await requireAuth()
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page || 1)

  const { urls, totalPages } = await getData(page, 15)

  return (
    <div className="px-2 max-h-screen space-y-5">
      <LinkHeader />
      <URLTable columns={columns} data={urls} totalPages={totalPages} currentPage={page} />
    </div>
  )
}
