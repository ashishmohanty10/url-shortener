import ResetPasswordForm from '@/components/auth/reset-password-form'
import { EmailSkeleton } from '@/components/skeletons/email-skeleton'
import { requireGuest } from '@/utils/auth-guard'
import { Suspense } from 'react'

export default async function ResetPassword() {
  await requireGuest()
  return (
    <div className="h-screen w-full flex items-center justify-center p-5 md:p-0">
      <Suspense fallback={<EmailSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
