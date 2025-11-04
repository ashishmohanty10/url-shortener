import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_PORT: z.string().min(1, 'NEXT_PUBLIC_APP_PORT is required'),

  // 🔐 Better Auth
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),

  // 🗄️ Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // 🔑 OAuth Providers
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // 🌍 App URL
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),

  // ✉️ Resend (email service)
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string(),

  // ☁️ Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  //Redis
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  TTL: z.string().min(1, 'TTL is required'),
  QUEUE_NAME: z.string().min(1, 'QUEUE_NAME is required'),

  // Redis Worker
  BATCH_SIZE: z.string().min(1, 'BATCH_SIZE is required'),
  FLUSH_INTERVAL_MS: z.string().min(1, 'FLUSH_INTERVAL_MS is required'),
})
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(parsed.error)
  throw new Error('Environment validation failed. Check your .env file.')
}

export const env = parsed.data
