import type { Metadata } from 'next'
import '../globals.css'
import { MobileNav, DesktopNav } from '@/components/common/sidebar-nav'

export const metadata: Metadata = {
  title: 'Shortened',
  description: 'Transform Every Link Into a Growth Opportunity',
  openGraph: {
    title: 'Shortened',
    description: 'Transform Every Link Into a Growth Opportunity',
    images: ['/og.png'],
  },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid h-screen bg-neutral-950 xl:grid-cols-[250px_1fr] w-full">
      <DesktopNav />
      <div className="p-2">
        <div className="rounded-lg border border-primary/10 h-full p-4 bg-gradient-to-br from-secondary/80 to-secondary/20">
          <MobileNav />
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
