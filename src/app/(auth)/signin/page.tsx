import { SigninForm } from '@/components/auth/signin-form'
import { requireGuest } from '@/utils/auth-guard'

export default async function Signin() {
  await requireGuest()
  return (
    <div className="h-screen w-full flex items-center justify-center p-5 md:p-0">
      <SigninForm />
    </div>
  )
}
