import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Frown size={32} />
        <h1>404 – Oops! Link Not Found</h1>
      </div>
      <p className="text-gray-500 mb-4">The link you followed may be broken or has expired.</p>
      <Button asChild className="mt-6">
        <Link href="/links">Go Back to Links</Link>
      </Button>
    </div>
  )
}
