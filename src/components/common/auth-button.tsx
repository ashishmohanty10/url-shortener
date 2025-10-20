import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const AuthButton = () => {
  return (
    <div className="flex items-center gap-x-3">
      <Button asChild variant="outline" className="card-bg">
        <Link href="/signin">Signin</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  )
}
