import { Container } from '@/components/common/container'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/signin')
  }
  return <Container>Dashboard</Container>
}
