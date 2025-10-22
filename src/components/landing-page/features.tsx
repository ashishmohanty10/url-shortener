import { Container } from '@/components/common/container'
import { FeaturesGrid } from '@/components/common/feature-item'
import { HeroSubTitle, HeroTitle, Tiles } from '@/components/common/titles'

export const Features = () => {
  return (
    <div className="border-y-axis" id="features">
      <Container className="border-x-axis flex flex-col items-center justify-center md:py-24">
        <Tiles className="w-fit mb-8">Features</Tiles>

        <HeroTitle className="mb-3"> Powerful Features to Elevate Every Link</HeroTitle>
        <HeroSubTitle className="text-center mb-10">
          From smart shortening to real-time analytics and AI-powered safety. <br /> Every feature
          is built to help you share links smarter, faster, and more securely.
        </HeroSubTitle>

        <FeaturesGrid />
      </Container>
    </div>
  )
}
