'use client'

import { NAVBAR_ITEMS } from '@/utils/constant'
import { Container } from '../common/container'
import Logo from '../icon/logo'
import Link from 'next/link'
import { AuthButton } from '@/components/common/auth-button'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useIsMobile } from '@/hooks/isMobile'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export const Navbar = () => {
  const isMobile = useIsMobile()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => setIsNavOpen(prev => !prev)

  return (
    <nav className="sticky top-0 z-50 border-y-axis bg-background/30 backdrop-blur-lg">
      <Container className="border-x-axis flex items-center justify-between py-4">
        {/* Left: Logo + Desktop Links */}
        <div className="flex items-center gap-x-10">
          <div className="flex items-center gap-x-2">
            <Logo className="size-7 leading-none" />
            <div className="text-2xl font-bold leading-none">ShortenURL</div>
          </div>

          {/* Desktop nav links */}
          <div className={`${isMobile ? 'hidden' : 'flex items-center gap-x-3'}`}>
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

        {/* Desktop Auth */}
        <div className={`${isMobile ? 'hidden' : 'block'}`}>
          <AuthButton />
        </div>

        {/* Mobile Menu Button */}
        <div className={`${isMobile ? 'block' : 'hidden'}`}>
          <Button size="icon" onClick={toggleNav} className="transition-transform z-50 relative">
            {isNavOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isNavOpen && isMobile && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-3/4 bg-background/95 border-l border-neutral-800 z-40 flex flex-col items-start gap-y-6 p-6"
          >
            {/* Close button */}
            <Button size="icon" onClick={toggleNav} className="absolute top-4 right-4">
              <X />
            </Button>

            {/* Nav Links */}
            <div className="flex flex-col gap-y-4 mt-6 w-full">
              {NAVBAR_ITEMS.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={toggleNav}
                  className="w-full text-neutral-300 hover:text-white text-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Button */}
            <div className="mt-auto w-full">
              <AuthButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
