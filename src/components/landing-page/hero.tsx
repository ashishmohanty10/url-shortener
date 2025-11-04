import { Container } from '@/components/common/container'
import { HeroSubTitle, HeroTitle, Tiles } from '@/components/common/titles'
import { URLShortenerHome } from '@/components/url/url-shortener-home'
import Image from 'next/image'

export const Hero = () => {
  return (
    <div className="border-y-axis">
      <Container className="border-x-axis py-24">
        <div className="flex flex-col items-center">
          <Tiles className="mb-5 w-fit">Introducing Shorten.</Tiles>
          <div className="mb-16">
            <HeroTitle className="mb-5">
              Transform Every Link <br /> Into a Growth Opportunity
            </HeroTitle>
            <HeroSubTitle className="text-center">
              Shorten, brand, and track your URLs with precision.
              <br className="hidden lg:block" /> Powerful analytics and custom domains{' '}
              <br className="md:hidden" /> Built for Creators, Businesses, and Developers.
            </HeroSubTitle>
          </div>

          <URLShortenerHome />
        </div>

        <div className="w-full h-full flex justify-center mt-10">
          <Image
            src="/demo-hero-img.webp"
            alt="Hero Image"
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            width={1000}
            height={1000}
            className="blur-sm"
          />
        </div>
      </Container>
    </div>
  )
}
