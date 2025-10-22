import { Container } from '@/components/common/container'
import { HeroSubTitle } from '@/components/common/titles'
import Logo from '@/components/icon/logo'
import { NAVBAR_ITEMS } from '@/utils/constant'
import Link from 'next/link'

export const Footer = () => {
  return (
    <>
      <div className="border-y-axis">
        <Container className="border-x-axis flex items-start justify-between">
          <div>
            <div className="flex items-center gap-x-2 ">
              <Logo className="size-7 leading-none" />
              <div className="text-2xl font-bold leading-none">ShortenURL</div>
            </div>
          </div>
          <div className="">
            <HeroSubTitle className="mb-4">Product</HeroSubTitle>

            {NAVBAR_ITEMS.map(items => (
              <Link
                className="flex flex-col mb-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                href={items.href}
                key={items.id}
              >
                {items.name}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <div className="border-y-axis">
        <Container className="border-x-axis text-sm md:text-base">
          © 2026 Your Company, Inc. All rights reserved.
        </Container>
      </div>
    </>
  )
}
