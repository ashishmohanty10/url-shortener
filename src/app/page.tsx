import { Hero } from '@/components/landing-page/hero'
import { CTA } from '@/components/landing-page/cta'
import { Navbar } from '@/components/landing-page/navbar'
import { Features } from '@/components/landing-page/features'
import { FAQS } from '@/components/landing-page/faqs'
import { Footer } from '@/components/landing-page/footer'
import { requireGuest } from '@/utils/auth-guard'

export default async function Home() {
  await requireGuest()
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <FAQS />
      <CTA />
      <Footer />
    </div>
  )
}
