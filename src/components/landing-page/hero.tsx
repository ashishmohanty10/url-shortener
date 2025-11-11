import { Container } from '@/components/common/container'
import { HeroSubTitle, HeroTitle, Tiles } from '@/components/common/titles'
import { AuthButton } from '../common/auth-button'

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

            <div className='flex items-center justify-center mt-5'>
              <AuthButton hideSignin signupText='Get Started Now!' />
            </div>
          </div>

        </div>

        <div className="w-full h-full flex justify-center rounded-sm">
          <video preload="auto" className='max-w-sm md:max-w-3xl lg:max-w-6xl w-full rounded-sm' autoPlay muted loop playsInline >
            <source src="/hero-video.mp4" type="video/mp4" />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </Container>
    </div>
  )
}
