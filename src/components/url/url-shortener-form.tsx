'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { creteLinkSchema, creteLinkSchemaType } from '@/lib/zod-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Atom, BadgeInfo } from 'lucide-react'
import { useForm } from 'react-hook-form'

export const URLShortenerForm = () => {
  const urlForm = useForm<creteLinkSchemaType>({
    resolver: zodResolver(creteLinkSchema),
    defaultValues: {
      originalUrl: '',
      shortCode: '',
      tags: [],
    },
  })

  return (
    <div className="grid grid-cols-4 gap-x-2">
      <div className="col-span-3">
        <Form {...urlForm}>
          <div className="flex flex-col space-y-5">
            <FormField
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
                </FormItem>
              )}
            />

            <FormField
              control={urlForm.control}
              name="shortCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col space-y-3">
                      <Label>Short Code</Label>
                      <div className="flex items-center gap-x-2">
                        <Input {...field} placeholder="Short Code" className="" />
                        <Button>
                          <Atom size={18} />
                          Generate code
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
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
                      <Input {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>

      <div className="col-span-1">QR</div>
    </div>
  )
}
