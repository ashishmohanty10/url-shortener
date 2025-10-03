'use client'

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, ResetPasswordSchemaType } from '@/lib/zod-schema'
import resetPasswordImg from '@/../public/reset-password-img.jpg'
import { useRouter } from 'next/navigation'
import { CustomButton } from '@/components/common/custom-button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { authClient } from '@/lib/auth-client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const error = searchParams.get('error')
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onBlur',
  })
  const { isSubmitting } = form.formState
  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  if (!token || error) {
    return (
      <div className="h-fit md:h-[30rem] w-full max-w-3xl rounded-md bg-neutral-800 p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-2xl font-semibold text-red-500">Invalid Reset Password Token</p>
          <p className="text-sm text-red-500">
            The Password Reset Token is invalid or has expired.
          </p>

          <Link href="/signin">
            <CustomButton variant="secondary" className="mt-4">
              Back to Login
            </CustomButton>
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    await authClient.resetPassword(
      {
        newPassword: values.password,
        token: token,
      },
      {
        onError: error => {
          toast.error(error.error.message || 'Please verify your email')
        },
        onSuccess: () => {
          toast.success('Password reset successfully')
          setTimeout(() => {
            router.push('/signin')
          }, 1000)
        },
      }
    )
  }

  return (
    <div className="h-fit md:h-[30rem] w-full max-w-3xl rounded-md bg-neutral-800 p-4">
      <div className="grid h-full w-full rounded-md md:grid-cols-2">
        {/* Left Side*/}
        <div className="col-span-1 mb-5 w-full overflow-hidden rounded-md md:mb-0 relative h-[100px] md:h-auto">
          <Image
            src={resetPasswordImg}
            alt="signin display image"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Right Side*/}
        <div className="col-span-1 flex w-full flex-col items-center justify-center md:px-4">
          <div className="mb-3 md:mb-10 flex flex-col items-center space-y-2 md:space-y-5">
            <h2 className="text-lg font-semibold">Reset Password</h2>
          </div>

          <Form {...form}>
            <form
              noValidate
              className="mb-2 flex w-full max-w-sm flex-col space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="group flex items-center rounded-md border border-neutral-700 pr-2 focus-within:border-neutral-500 focus-within:bg-neutral-900">
                        <Input
                          placeholder="Password"
                          {...field}
                          className="border-none placeholder:text-neutral-300"
                          type={showPassword ? 'text' : 'password'}
                        />

                        {showPassword ? (
                          <EyeOff
                            onClick={handleShowPassword}
                            className={cn(
                              'cursor-pointer text-neutral-400 transition-colors hover:text-white',
                              showPassword && 'text-white'
                            )}
                          />
                        ) : (
                          <Eye
                            onClick={handleShowPassword}
                            className="cursor-pointer text-neutral-400 transition-colors hover:text-white"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <CustomButton type="submit" variant="primary" size="medium" isLoading={isSubmitting}>
                Reset Password
              </CustomButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
