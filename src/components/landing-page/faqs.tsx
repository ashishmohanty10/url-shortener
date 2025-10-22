import { Container } from '@/components/common/container'
import { HeroSubTitle, HeroTitle, Tiles } from '@/components/common/titles'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQS() {
  return (
    <div className="border-y-axis" id="faqs">
      <Container className="border-x-axis flex flex-col justify-center items-center  md:py-24">
        <Tiles className="w-fit mb-8">FAQS</Tiles>
        <HeroTitle className="mb-3">Frequently Asked Questions</HeroTitle>
        <HeroSubTitle className="text-center mb-10">
          Have questions about how our URL shortener works? We’ve got you covered.
          <br /> Explore the most common queries about analytics, safety, customization, and more.
        </HeroSubTitle>
        <Accordion type="single" collapsible className="w-full max-w-xl" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does the URL shortener work?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Our URL shortener instantly converts long, messy links into short, clean, and
                shareable URLs. Simply paste your original link and we’ll generate a unique short
                URL that’s easy to share anywhere.
              </p>
              <p>
                Behind the scenes, our system securely stores and redirects users to the original
                destination.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Do shortened links expire or have limits?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                No — your links never expire unless you choose to delete them. Free users can create
                up to 1,000 links per month, while Pro users enjoy unlimited shortening and
                analytics access.
              </p>
              <p>You can also manage, edit, or disable links anytime from your dashboard.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What kind of analytics can I see?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                You get real-time analytics including total clicks, top countries, referrers,
                devices, and time-based trends. Our dashboard visualizes your link performance to
                help you understand your audience.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Are the links secure and safe?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Absolutely. Every link is scanned by our AI-powered safety system for phishing,
                malware, and spam content before activation.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Can I customize my short URLs?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Yes! You can personalize the slug part of your shortened link (for example:{' '}
                <code>mybrand.link/sale</code>) and even connect your own custom domain for branding
                consistency.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Container>
    </div>
  )
}
