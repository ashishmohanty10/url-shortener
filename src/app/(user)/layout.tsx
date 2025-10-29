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
    <div className="grid h-screen bg-neutral-950 lg:grid-cols-[250px_1fr] w-full">
      <div className="px-2 py-4">
        <div className="p-2 w-full h-full bg-gradient-to-br from-secondary/80 to-secondary/20 rounded-lg">
          <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center gap-x-4 py-4">
                <Logo className="size-7 leading-none" />
                <div className="text-2xl font-bold leading-none">ShortenURL</div>
              </div>

              <Sidebar />
            </div>
            <UserButton />
          </div>
        </div>
      </div>
      <div className="px-2 py-4">
        <div className="rounded-lg border border-primary/10 h-full p-4 bg-gradient-to-br from-secondary/80 to-secondary/20">
          {children}
        </div>
      </div>
    </div>
  )
}
