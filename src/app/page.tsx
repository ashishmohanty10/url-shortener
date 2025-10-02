import { Container } from '@/components/common/container'
import { URLShortenerForm } from '@/components/url/url-shortener-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  return <Container className="flex h-screen w-full items-center justify-center">hi</Container>
}
