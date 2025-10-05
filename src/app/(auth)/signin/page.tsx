import { SigninForm } from '@/components/auth/signin-form'
import { auth } from '@/lib/auth'
import { requireGuest } from '@/utils/auth-guard'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Signin() {
  await requireGuest()
  return (
    <div className="h-screen w-full flex items-center justify-center p-5 md:p-0">
      <SigninForm />
    </div>
  )
}
