'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { SUPPORTED_OAUTH_PROVIDERS, SUPPORTED_OAUTH_PROVIDERS_DETAILS } from '@/utils/constant'
import { toast } from 'sonner'

export function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map(provider => {
    const Icon = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].Icon

    const handleSubmit = async () => {
      await authClient.signIn.social(
        { provider, callbackURL: '/links' },
        {
          onError: error => {
            toast.error(
              error.error.message ||
                `${SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name} signin failed`
            )
          },
          onSuccess: () => {
            toast.success('Signin successful')
          },
        }
      )
    }
    return (
      <Button
        key={provider}
        className="bg-neutral-200 hover:bg-neutral-700 transition-colors"
        onClick={handleSubmit}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name}
      </Button>
    )
  })
}
