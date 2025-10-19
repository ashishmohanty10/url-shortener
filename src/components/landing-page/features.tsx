import { Container } from '@/components/common/container'
import { HeroSubTitle, HeroTitle, Paragraph, Tiles } from '@/components/common/titles'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const Features = () => {
  return (
    <div className="border-y-axis" id="features">
      <Container className="border-x-axis flex flex-col items-center justify-center">
        <Tiles className="w-fit mb-8">Features</Tiles>

        <HeroTitle className="mb-3"> Powerful Features to Elevate Every Link</HeroTitle>
        <HeroSubTitle className="text-center mb-10">
          From smart shortening to real-time analytics and AI-powered safety. <br /> Every feature
          is built to help you share links smarter, faster, and more securely.
        </HeroSubTitle>
        <div className="space-y-10">
          {/* Feature 1 */}
          <FeatureCard>
            <div className="space-y-4 text-center">
              <HeroSubTitle>Branded Short Links</HeroSubTitle>
              <Paragraph>
                Create memorable, on-brand short URLs using custom domains and vanity paths that
                build trust and increase CTR.
              </Paragraph>
            </div>

            <div className="flex justify-center">
              <Image
                src="/brand.webp"
                alt="Branded Short Links"
                width={500}
                height={500}
                quality={75}
                loading="lazy"
                className="w-full max-w-[500px] h-auto rounded-2xl border border-neutral-800 shadow-lg transition-transform duration-300"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 500px"
              />
            </div>
          </FeatureCard>

          {/* Feature 2 */}
          <FeatureCard>
            <div className="flex justify-center">
              <Image
                src="/analytics.webp"
                alt="Advanced Analytics"
                width={500}
                height={500}
                quality={75}
                loading="lazy"
                className="w-full max-w-[500px] h-auto rounded-2xl border border-neutral-800 shadow-lg transition-transform duration-300"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 500px"
              />
            </div>
            <div className="space-y-4 text-center">
              <HeroSubTitle>Advanced Analytics</HeroSubTitle>
              <Paragraph>
                Real-time click analytics, geolocation, referrers, and device breakdowns — turn raw
                clicks into actionable insights.
              </Paragraph>
            </div>
          </FeatureCard>

          {/* Feature 3 */}
          <FeatureCard>
            <div className="space-y-4  text-center">
              <HeroSubTitle>🧠 Smart Link Safety (AI-Powered)</HeroSubTitle>
              <Paragraph>
                AI-powered safety check scans every link in real-time to detect malicious, phishing,
                or spam URLs — keeping your users safe and your reputation intact.{' '}
              </Paragraph>
            </div>
            <div className="flex justify-center">
              <Image
                src="/ai.webp"
                alt="Smart Link Safety (AI-Powered)"
                width={500}
                height={500}
                quality={75}
                loading="lazy"
                className="w-full max-w-[500px] h-auto rounded-2xl border border-neutral-800 shadow-lg transition-transform duration-300"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 500px"
              />
            </div>
          </FeatureCard>

          {/* Feature 4 */}
          <FeatureCard>
            <div className="flex justify-center">
              <Image
                src="/qr.webp"
                alt="Dynamic QR Codes"
                width={500}
                height={500}
                quality={75}
                loading="lazy"
                className="w-full max-w-[500px] h-auto rounded-2xl border border-neutral-800 shadow-lg transition-transform duration-300"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 500px"
              />
            </div>
            <div className="space-y-4  text-center">
              <HeroSubTitle>Dynamic QR Codes</HeroSubTitle>
              <Paragraph>
                Dynamic QR codes for every link — fully editable even after creation, complete with
                real-time tracking insights.
              </Paragraph>
            </div>
          </FeatureCard>
        </div>
      </Container>
    </div>
  )
}

interface FeatureCardTypes {
  children: React.ReactNode
  className?: string
}

export const FeatureCard = ({ children, className }: FeatureCardTypes) => {
  return <div className={cn('grid grid-cols-2 gap-x-3 items-center', className)}>{children}</div>
}
