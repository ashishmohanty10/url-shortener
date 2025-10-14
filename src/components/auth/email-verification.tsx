'use client'

import { authClient } from '@/lib/auth-client'
import { CustomButton } from '../common/custom-button'
import { useEffect, useRef, useState } from 'react'

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(0)
  const interval = useRef<NodeJS.Timeout>(undefined)

  const startEmailVerificationCountdown = (time = 30) => {
    setTimeToNextResend(time)
    clearInterval(interval.current)

    interval.current = setInterval(() => {
      setTimeToNextResend(time => {
        const newTime = time - 1
        if (newTime <= 0) {
          clearInterval(interval.current)
          return 0
        }
        return newTime
      })
    }, 1000)
  }

  useEffect(() => {
    startEmailVerificationCountdown()
  }, [])
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link. Please check your email and click the link to verify your
        account.
      </p>

      <CustomButton
        variant="primary"
        size="medium"
        onClick={() => {
          return authClient.sendVerificationEmail({
            email,
            callbackURL: '/links',
          })
        }}
        disabled={timeToNextResend > 0}
      >
        {timeToNextResend > 0 ? `Resend Email (${timeToNextResend})` : 'Resend Email'}
      </CustomButton>
    </div>
  )
}
