import type { Metadata } from 'next'
import '../globals.css'
import { UserButton } from '@/components/user/user-button'
import Logo from '@/components/icon/logo'
import { Sidebar } from '@/components/common/sidebar'

export const metadata: Metadata = {
  title: 'Shortened',
  description: 'Generated shortened url which is easy to share and manage',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[220px_1fr] w-full">
      <div className="p-2 bg-secondary min-h-screen w-full">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center gap-x-4">
              <Logo className="size-8" />
              <span className="text-xl font-semibold uppercase">Shortened</span>
            </div>

            <Sidebar />
          </div>
          <UserButton />
        </div>
      </div>
      <div className="p-4 min-h-screen bg-secondary/70 rounded-l-lg border-l border-primary/10">
        {children}
      </div>
    </div>
  )
}
