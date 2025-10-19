'use client'

import { CustomButton } from '@/components/common/custom-button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { URLFormType, urlSchema } from '@/lib/zod-schema'
import { shortenURLAction } from '@/server/url-shorten-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function URLShortenerHome() {
  // const [shortURL, setShortURL] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<URLFormType>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
    mode: 'onSubmit',
  })
  const { isSubmitting } = form.formState
  const onSubmit = async (values: URLFormType) => {
    try {
      const formData = new FormData()
      formData.append('url', values.url)
      const response = await shortenURLAction(formData)
      if (response.success && response.data) {
        // setShortURL(response.data.shortURL)
        setError(null)
      } else {
        // setShortURL(null)
        setError(response.error ?? 'Failed To shorten url')
      }
    } catch {
      setError('Something went wrong')
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 items-center">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Paste URL here..."
                      className={cn(
                        'max-w-md rounded-md border border-neutral-700 transition-colors',
                        'focus:border-neutral-500 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200',
                        'placeholder:text-neutral-300'
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <CustomButton type="submit" variant="primary" size="medium" isLoading={isSubmitting}>
              Shorten Now!
            </CustomButton>
          </div>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </form>
      </Form>
    </div>
  )
}
