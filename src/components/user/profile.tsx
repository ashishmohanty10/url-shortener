'use client'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { StatCard } from '../common/profile-stat-card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar1, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { uploadImageToCloudinaryAction } from '@/server/upload-image-cloudinary'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Session } from '@/lib/auth'
import { profileImageSchema, profileImageSchemaType } from '@/lib/zod-schema'
import Image from 'next/image'
import { LogoutButton } from '../common/logout-button'

export function Profile({
  session,
  bg,
  count,
  totalClicks,
}: {
  session: Session
  bg: string
  count: number
  totalClicks: number
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(session?.user.image || '')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const router = useRouter()

  const form = useForm<profileImageSchemaType>({
    resolver: zodResolver(profileImageSchema),
  })

  const onSubmit = async (data: profileImageSchemaType) => {
    const file = data.avatar
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadImageToCloudinaryAction(formData)

      if (result.success) {
        setAvatarUrl(result.imageUrl)
        setPreviewUrl('')
        toast.success('Profile image updated successfully')
        form.reset()
        setIsDialogOpen(false)
        await authClient.updateUser({
          image: result.imageUrl,
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating profile image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update profile image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageError = () => {
    setAvatarUrl('https://github.com/shadcn.png')
  }

  return (
    <div className="h-full flex flex-col w-full">
      <div className={`h-[14rem] w-full rounded-lg`} style={{ background: bg }}></div>

      {/* Profile Header */}
      <div className="lg:px-16">
        <div className="lg:border-b border-neutral-750 lg:flex items-center justify-between gap-x-4">
          <div className="flex items-center justify-center lg:justify-start gap-x-4">
            <div className="relative -translate-y-16">
              <Avatar className="size-48">
                <AvatarImage src={avatarUrl} onError={handleImageError} className="bg-primary" />
                <AvatarFallback>{session?.user.name?.split(' ')[0].charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                      Upload Avatar
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Image</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 items-start justify-between">
                          <div className="col-span-1 w-full flex justify-center">
                            <div className="size-28 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              {previewUrl ? (
                                <Image
                                  src={previewUrl}
                                  alt="Preview"
                                  height={112}
                                  width={112}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">Preview</span>
                              )}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="mb-5">
                              <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field: { onChange } }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploading}
                                        onChange={event => {
                                          const file = event.target.files?.[0]
                                          if (file) {
                                            if (previewUrl) URL.revokeObjectURL(previewUrl)
                                            onChange(file)
                                            const url = URL.createObjectURL(file)
                                            setPreviewUrl(url)
                                          } else {
                                            onChange(null)
                                            setPreviewUrl('')
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isUploading}>
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button type="submit" disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Upload'}
                              </Button>
                            </DialogFooter>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-x-2">
            <StatCard label="Total Shortened URLs" value={count} />
            <StatCard label="Total Clicks" value={totalClicks} />
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-12">
          <div className="card-bg rounded-lg p-4 flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm">Name</p>
              <p className="text-base md:text-xl text-foreground font-semibold">
                {session?.user.name}
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm">Email</p>
              <p className="text-base md:text-xl text-foreground font-semibold flex items-center gap-x-2">
                {session?.user.email}{' '}
                {session?.user.emailVerified ? (
                  <ShieldCheck className="text-blue-500" />
                ) : (
                  <ShieldAlert className="text-red-500" />
                )}
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm">Member Since</p>
              <p className="text-base md:text-xl text-foreground font-semibold flex items-center gap-x-2">
                <Calendar1 />
                {session?.user.createdAt.toISOString().split('T')[0]}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <LogoutButton variant="destructive" />
          </div>
        </div>
      </div>
    </div>
  )
}
