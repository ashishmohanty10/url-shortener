'use server'

import prisma from '@/db/prisma'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/utils/auth-guard'
import { cloudinary } from '@/lib/config'
import { fileSchema } from '@/lib/zod-schema'
import { UploadApiResponse } from 'cloudinary'

export async function uploadImageToCloudinaryAction(formData: FormData) {
  const { user } = await requireAuth()
  const file = formData.get('file') as File

  if (!file) {
    throw new Error('No file provided')
  }

  const validationResult = fileSchema.safeParse(file)
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues[0].message)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `url-shortener/${user.id}`, resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result!)
        }
      )
      uploadStream.end(buffer)
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { image: uploadResult.secure_url },
    })

    revalidatePath('/profile')

    return {
      success: true,
      imageUrl: uploadResult.secure_url,
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error(error instanceof Error ? error.message : 'Upload failed')
  }
}
