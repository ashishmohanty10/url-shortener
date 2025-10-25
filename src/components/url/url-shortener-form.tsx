'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { creteLinkSchema, creteLinkSchemaType } from '@/lib/zod-schema'
import { generateRandomString } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Atom, BadgeInfo, Link2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { CustomButton } from '../common/custom-button'

export const URLShortenerForm = () => {
  const [submitting, setSubmitting] = useState(false)
  const urlForm = useForm<creteLinkSchemaType>({
    resolver: zodResolver(creteLinkSchema),
    defaultValues: {
      originalUrl: '',
      shortCode: '',
      tags: [],
    },
    mode: 'onChange',
  })

  const generateShortCode = () => {
    urlForm.setValue('shortCode', generateRandomString())
  }

  const onSubmit = async (data: creteLinkSchemaType) => {
    const tagsArray = data.tags
      .join(',')
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .slice(0, 5)

    const finalData = { ...data, tags: tagsArray }
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Link created successfully')
      } else {
        console.error('Failed to create link:', result)
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Failed to create link:', error)
      toast.error('Failed to create link')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center" variant="default">
          <Link2 />
          Create Links
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Links</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...urlForm}>
            <form onSubmit={urlForm.handleSubmit(onSubmit)} className="flex flex-col space-y-5">
              <FormField
                disabled={submitting}
                control={urlForm.control}
                name="originalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col space-y-3">
                        <Label>Original URL</Label>
                        <Input {...field} placeholder="Paste URL here..." />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={submitting}
                control={urlForm.control}
                name="shortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col space-y-3">
                        <Label>Short Code</Label>
                        <div className="flex items-center gap-x-2">
                          <Input {...field} placeholder="Short Code" className="flex-1" />
                          <Button onClick={generateShortCode} type="button">
                            <Atom size={18} />
                            Generate code
                          </Button>
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={submitting}
                control={urlForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col space-y-3">
                        <Label className="flex items-start gap-x-2">
                          Tags
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeInfo size={16} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Tags can be used to filter out links</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          placeholder="Tags (comma-separated)"
                          onChange={e => {
                            const tagsArray = e.target.value
                              .split(',')
                              .map(t => t.trim())
                              .filter(Boolean)
                              .slice(0, 5)
                            field.onChange(tagsArray)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <CustomButton type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Link'}
                  </CustomButton>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
