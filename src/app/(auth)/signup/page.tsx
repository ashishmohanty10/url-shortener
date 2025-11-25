import { SignupForm } from '@/components/auth/signup-form'
// import { requireGuest } from '@/utils/auth-guard'

export default async function Signup() {
  // await requireGuest()
  return (
    <div className="h-screen w-full flex items-center justify-center p-5 md:p-0">
      <SignupForm />
    </div>
  )
}
