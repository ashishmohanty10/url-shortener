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
import { Separator } from '../ui/separator'

export const URLShortenerForm = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<creteLinkSchemaType>({
    resolver: zodResolver(creteLinkSchema),
    defaultValues: { originalUrl: '', shortCode: '', tags: '' },
    mode: 'onChange',
  })

  const generateShortCode = () => {
    form.setValue('shortCode', generateRandomString())
  }

  const onSubmit = async (data: creteLinkSchemaType) => {
    setSubmitting(true)
    setOpen(true)
    try {
      const finalData = {
        ...data,
        originalUrl: ensureHttps(data.originalUrl.trim()),
        tags: data.tags?.trim() || '',
      }

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      })

      const result = await response.json()
      if (result.success) {
        form.reset()
        setOpen(false)
        toast.success('Link created successfully!')
        setTimeout(() => {
          router.refresh()
        }, 300)
      } else {
        toast.error(result.error || 'Failed to create link')
      }
    } catch (error) {
      setOpen(false)
      console.error(error)
      toast.error('An unexpected error occurred')
    } finally {
      setSubmitting(false)
      setOpen(false)
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

        <Separator />

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

            {/* Tag */}
            <FormField
              control={form.control}
              name="tags"
              disabled={submitting}
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-2">
                    Tag
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo size={16} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Only letters and numbers allowed (Max 1)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. blog or promo or campaign2024"
                      onChange={e => {
                        const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                        field.onChange(cleanedValue)
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
