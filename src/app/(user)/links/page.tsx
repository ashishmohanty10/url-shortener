import { LinkHeader } from '@/components/links/links-header'
import { requireAuth } from '@/utils/auth-guard'
import { URLTable } from './data-table'
import { columns } from './columns'
import { getUserUrlAction } from '@/server/get-user-url-action'

export default async function DashboardPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  await requireAuth()
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page || 1)
  const search = searchParams?.search || ''

  const { urls, totalPages } = await getUserUrlAction(page, 15, search)

  return (
    <div className="px-2 space-y-5 lg:space-y-10 w-full">
      <LinkHeader />
      <URLTable
        columns={columns}
        data={urls}
        totalPages={totalPages}
        currentPage={page}
        initialFilter={search}
      />
    </div>
  )
}
