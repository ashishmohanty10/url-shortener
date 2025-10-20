import { AuthButton } from '@/components/common/auth-button'
import { Container } from '@/components/common/container'
import { Paragraph, Tiles } from '@/components/common/titles'

export const CTA = () => {
  return (
    <div className="border-y-axis">
      <Container className="border-x-axis">
        <div className="h-64 relative w-full">
          <div className="rounded-md absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0072E5_70%)] animate-gradient-wave"></div>

          <div className="flex flex-col h-full items-center justify-center">
            <Tiles className="mb-5">Shorten. Share. Track.</Tiles>
            <Paragraph className="mb-3">
              Turn long, messy links into smart short URLs with analytics and QR codes in seconds.
            </Paragraph>

            <AuthButton />
          </div>
        </div>
      </Container>
    </div>
  )
}
