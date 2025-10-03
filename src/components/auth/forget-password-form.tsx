'use client'

import { useForm } from 'react-hook-form'
import { CustomButton } from '../common/custom-button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, ForgotPasswordSchemaType } from '@/lib/zod-schema'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { ChevronLeft } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  })
  const { isSubmitting } = form.formState
  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    await authClient.requestPasswordReset(
      {
        ...values,
        redirectTo: '/reset-password',
      },
      {
        onError: error => {
          toast.error(error.error.message || 'Please verify your email')
        },
        onSuccess: () => {
          toast.success('Password reset email sent')
        },
      }
    )
  }
  return (
    <div className="w-full">
      <div className="mb-3 md:mb-10 flex flex-col items-center space-y-2 md:space-y-5">
        <h2 className="text-lg font-semibold">Reset your Password</h2>
      </div>

      <Form {...form}>
        <form
          noValidate
          className="mb-2 flex w-full max-w-sm flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    type="email"
                    className={cn(
                      'w-full rounded-md border border-neutral-700 transition-colors',
                      'focus:border-neutral-500 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200',
                      'placeholder:text-neutral-300'
                    )}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex w-full gap-2">
            <CustomButton
              type="button"
              variant="secondary"
              onClick={onBack}
              className="w-1/2 flex items-center gap-x-2"
            >
              <ChevronLeft />
              Cancel
            </CustomButton>

            <CustomButton
              type="submit"
              variant="primary"
              size="medium"
              isLoading={isSubmitting}
              className="w-1/2 flex items-center gap-x-2"
            >
              Reset Password
            </CustomButton>
          </div>
        </form>
      </Form>
    </div>
  )
}
