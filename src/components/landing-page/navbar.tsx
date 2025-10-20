import { NAVBAR_ITEMS } from '@/utils/constant'
import { Container } from '../common/container'
import Logo from '../icon/logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/components/common/auth-button'

export const Navbar = () => {
  return (
    <div className="border-y-axis">
      <Container className="border-x-axis flex items-center justify-between">
        <div className="flex items-center gap-x-10">
          <div className="flex items-center gap-x-2 ">
            <Logo className="size-7 leading-none" />
            <div className="text-2xl font-bold leading-none">ShortenURL</div>
          </div>

          <div className="lg:flex items-center gap-x-3 hidden">
            {NAVBAR_ITEMS.map(item => (
              <Link
                scroll
                key={item.id}
                href={item.href}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <AuthButton />
        </div>
      </Container>
    </div>
  )
}
