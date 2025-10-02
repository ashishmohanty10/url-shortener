import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shortened',
  description: 'Generated shortened url which is easy to share and manage',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
