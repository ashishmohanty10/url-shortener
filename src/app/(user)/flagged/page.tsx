import { requireAuth } from '@/utils/auth-guard'
import { flaggedColumns } from './flagged-column'
import { URLFlaggedTable } from './data-table-flagged'
import { PageHeader } from '@/components/common/titles'
import { getAllUrlsDataAction } from '@/server/admin/get-all-urls-data-action'
import { redirect } from 'next/navigation'

export default async function DashboardPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { user } = await requireAuth()

  if (user.role !== 'admin') {
    redirect('/links')
  }
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page || 1)
  const search = searchParams?.search || ''

  const { urls, totalPages } = await getAllUrlsDataAction(page, 15, search)

  return (
    <div className="px-2 space-y-5 lg:space-y-10 w-full">
      <PageHeader>All Links</PageHeader>
      <URLFlaggedTable
        columns={flaggedColumns}
        data={urls}
        totalPages={totalPages}
        currentPage={page}
        initialFilter={search}
      />
    </div>
  )
}
