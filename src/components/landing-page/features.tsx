import { Container } from '@/components/common/container'
import { FeatureCard, HeroSubTitle, HeroTitle, Paragraph, Tiles } from '@/components/common/titles'
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

        <div className="grid grid-cols-5 gap-x-3 w-full h-full">
          <div className="col-span-3 h-full">
            <div>
              <FeatureCard>
                <Image
                  alt="Custom Links & Branding"
                  src="/brand.webp"
                  width={500}
                  height={500}
                  loading="lazy"
                  quality={100}
                  className="w-full object-cover rounded-lg mb-8"
                />
                <div>
                  <Paragraph className="mb-3">Custom Links & Branding</Paragraph>
                  <p className="text-sm text-balance">
                    Create memorable, on-brand short URLs using custom domains and vanity paths that
                    build trust and increase CTR.
                  </p>
                </div>
              </FeatureCard>
              <div className="grid grid-cols-2 gap-x-3 mt-5">
                <FeatureCard>
                  <Image
                    alt="Dynamic QR Codes"
                    src="/qr.webp"
                    width={500}
                    height={500}
                    loading="lazy"
                    quality={100}
                    className="w-full object-cover rounded-lg mb-8"
                  />
                  <div>
                    <Paragraph className="mb-3">Dynamic QR Codes</Paragraph>
                    <p className="text-sm text-balance">
                      Generate customizable QR codes for every link — editable anytime, with
                      built-in tracking.
                    </p>
                  </div>
                </FeatureCard>
                <FeatureCard>
                  <Image
                    alt="Smart Link Safety"
                    src="/ai.webp"
                    width={500}
                    height={500}
                    loading="lazy"
                    quality={100}
                    className="w-full object-cover rounded-lg mb-8"
                  />
                  <div>
                    <Paragraph className="mb-3">Smart Link Safety</Paragraph>
                    <p className="text-sm text-balance">
                      Our AI-powered safety engine scans every link in real-time to detect
                      malicious, phishing, or spam URLs.
                    </p>
                  </div>
                </FeatureCard>
              </div>
            </div>
          </div>
          <div className="col-span-2 grid grid-rows-2">
            <FeatureCard>
              <Image
                alt="Advanced Analytics"
                src="/analytics.webp"
                width={500}
                height={500}
                loading="lazy"
                quality={100}
                className="w-full object-cover rounded-lg"
              />

              <div>
                <Paragraph className="mb-3">Advanced Analytics</Paragraph>
                <p className="text-sm text-balance">
                  Real-time click analytics, geolocation, referrers, and device breakdowns — turn
                  raw clicks into actionable insights.
                </p>
              </div>
            </FeatureCard>

            <FeatureCard className="mt-5">
              <Image
                alt="Smart SEO & OG Proxy"
                src="/seo.webp"
                width={500}
                height={500}
                loading="lazy"
                quality={100}
                className="w-full object-cover rounded-lg mb-8"
              />

              <div>
                <Paragraph className="mb-3">Smart SEO & OG Proxy</Paragraph>
                <p className="text-sm text-balance">
                  When you share a branded short link, it automatically shows the original page’s
                  title, description, and preview image — while keeping your own domain for trust
                  and analytics. Perfect for social media sharing and SEO consistency.
                </p>
              </div>
            </FeatureCard>
          </div>
        </div>
      </Container>
    </div>
  )
}
