'use client'

import Image from 'next/image'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, SignInSchemaType } from '@/lib/zod-schema'
import signInSideImage from '@/../public/signin-side-img.jpg'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SocialAuthButtons } from '@/components/auth/social-auth-button'
import { CustomButton } from '@/components/common/custom-button'
import Link from 'next/link'
import { EmailVerification } from './email-verification'
import { ForgotPasswordForm } from './forget-password-form'

export function SigninForm() {
  const router = useRouter()
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })
  const { isSubmitting } = form.formState
  const [showPassword, setShowPassword] = useState(false)
  const [needsVerification, setNeedsVerification] = useState<string | null>(null)
  const [forgotPassword, setForgotPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  const onSubmit = async (values: SignInSchemaType) => {
    await authClient.signIn.email(
      { ...values, callbackURL: '/dashboard' },
      {
        onError: error => {
          if (error.error.code === 'EMAIL_NOT_VERIFIED') {
            setNeedsVerification(values.email)
            return
          }
          toast.error(error.error.message || 'Please verify your email')
        },
        onSuccess: () => {
          router.push('/dashboard')
          toast.success('Signin successful')
        },
      }
    )
  }

  return (
    <div className="h-fit md:h-[30rem] w-full max-w-3xl rounded-md bg-neutral-800 p-4">
      {needsVerification ? (
        <EmailVerification email={needsVerification} />
      ) : (
        <div className="grid h-full w-full rounded-md md:grid-cols-2">
          {/* Left Side*/}
          <div className="col-span-1 mb-5 w-full overflow-hidden rounded-md md:mb-0 relative h-[100px] md:h-auto">
            <Image
              src={signInSideImage}
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
            {forgotPassword ? (
              <ForgotPasswordForm onBack={() => setForgotPassword(false)} />
            ) : (
              <>
                <div className="mb-3 md:mb-10 flex flex-col items-center space-y-2 md:space-y-5">
                  <h2 className="text-lg font-semibold">Welcome! Back</h2>
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
                          <div
                            className="text-sm text-neutral-400 cursor-pointer hover:underline float-end mt-2 hover:text-white"
                            onClick={() => setForgotPassword(true)}
                          >
                            Forgot Password?
                          </div>
                        </FormItem>
                      )}
                    />

                    <CustomButton
                      type="submit"
                      variant="primary"
                      size="medium"
                      isLoading={isSubmitting}
                    >
                      Signin
                    </CustomButton>
                  </form>
                </Form>

                <p className="text-center text-sm font-normal text-neutral-400">
                  Don&apos;t have an account!{' '}
                  <Link href={'/signup'}>
                    <span className="cursor-pointer font-medium text-white hover:underline">
                      Create Now
                    </span>{' '}
                  </Link>
                  for free
                </p>

                <Separator className="border-b border-neutral-600 my-4" />

                <div className="flex items-center gap-x-2">
                  <SocialAuthButtons />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
