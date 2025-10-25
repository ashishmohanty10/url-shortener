import { PageHeader } from '@/components/common/titles'
import { URLShortenerForm } from '@/components/url/url-shortener-form'

export function LinkHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <PageHeader>Links</PageHeader>
      <URLShortenerForm />
    </div>
  )
}
