'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Atom, BadgeInfo, Link2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CustomButton } from '@/components/common/custom-button'

import { ensureHttps, generateRandomString } from '@/lib/utils'
import { creteLinkSchema, creteLinkSchemaType } from '@/lib/zod-schema'

export const URLShortenerForm = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<creteLinkSchemaType>({
    resolver: zodResolver(creteLinkSchema),
    defaultValues: { originalUrl: '', shortCode: '', tags: [] },
    mode: 'onChange',
  })

  const generateShortCode = () => {
    form.setValue('shortCode', generateRandomString())
  }

  // 🧠 Auto-generate code when a valid URL is entered
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'originalUrl' && values.originalUrl) {
        const isValidUrl = /^https?:\/\/|^[\w-]+\.[a-z]{2,}/i.test(values.originalUrl)
        const currentCode = form.getValues('shortCode')
        if (isValidUrl && !currentCode) {
          generateShortCode()
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: creteLinkSchemaType) => {
    setSubmitting(true)
    try {
      const tagsArray = data.tags
        .join(',')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
        .slice(0, 5)

      const finalData = {
        ...data,
        originalUrl: ensureHttps(data.originalUrl.trim()),
        tags: tagsArray,
      }

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Link created successfully!')
        form.reset()
        router.refresh()
        setOpen(false)
      } else {
        toast.error(result.error || 'Failed to create link')
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const originalUrl = form.watch('originalUrl')
  const shortCode = form.watch('shortCode')
  const isSubmitEnabled = !!originalUrl && !!shortCode && form.formState.isValid

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Link2 size={18} />
          Create Link
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create a Short URL</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-4">
            {/* Original URL */}
            <FormField
              control={form.control}
              name="originalUrl"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <Label>Original URL</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Paste URL here..."
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && form.handleSubmit(onSubmit)()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Code */}
            <FormField
              control={form.control}
              name="shortCode"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <Label>Short Code</Label>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input {...field} placeholder="Short code" className="flex-1" />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={e => {
                          e.preventDefault()
                          generateShortCode()
                        }}
                      >
                        <Atom size={16} className="mr-1" />
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-2">
                    Tags
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo size={16} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comma-separated tags (max 5)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <FormControl>
                    <Input
                      value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                      placeholder="e.g. blog, promo, campaign"
                      onChange={e => {
                        const tagsArray = e.target.value
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean)
                          .slice(0, 5)
                        field.onChange(tagsArray)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer Actions */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <CustomButton type="submit" disabled={submitting || !isSubmitEnabled}>
                {submitting ? 'Creating...' : 'Create Link'}
              </CustomButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
