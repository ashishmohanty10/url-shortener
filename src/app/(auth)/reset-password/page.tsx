import ResetPasswordForm from '@/components/auth/reset-password-form'
import { EmailSkeleton } from '@/components/common/email-skeleton'
import { Suspense } from 'react'

export default function ResetPassword() {
  return (
    <div className="h-screen w-full flex items-center justify-center p-5 md:p-0">
      <Suspense fallback={<EmailSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
