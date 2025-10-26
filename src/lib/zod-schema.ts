import z from 'zod'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneNumberPattern = /^[\+]?[\d\s\-\(\)]{10,}$/

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),

  password: z.string().trim().min(1, { message: 'Password is required' }),
})

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),

  name: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(50, { message: 'Full name cannot exceed 50 characters' })
    .refine(name => !emailPattern.test(name), {
      message: 'Full name cannot be an email address',
    })
    .refine(name => !phoneNumberPattern.test(name), {
      message: 'Full name cannot be a phone number',
    })
    .refine(name => /^[a-zA-Z\s\-'\.]+$/.test(name), {
      message: 'Full name can only contain letters, spaces, hyphens',
    }),

  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password cannot exceed 128 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
})

export const signUpWithConfirmSchema = signUpSchema
  .extend({
    confirmPassword: z.string().trim(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
})

export const resetPasswordSchema = z.object({
  password: z.string().trim().min(1, { message: 'Password is required' }),
})

export const fileSchema = z
  .instanceof(File, { message: 'Please select an image file' })
  .refine(file => file.type.startsWith('image/'), {
    message: 'Only image files are allowed',
  })
  .refine(file => file.size <= 5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  })

export const profileImageSchema = z.object({
  avatar: fileSchema,
})

export const creteLinkSchema = z.object({
  originalUrl: z.string().url(),
  shortCode: z.string().min(1),
  tags: z.array(z.string()),
})

export const urlSchema = z.object({
  url: z.string().url('Please Enter valid URL'),
})

export type creteLinkSchemaType = z.infer<typeof creteLinkSchema>
export type profileImageSchemaType = z.infer<typeof profileImageSchema>
export type fileSchemaType = z.infer<typeof fileSchema>
export type SignInSchemaType = z.infer<typeof signInSchema>
export type URLFormType = z.infer<typeof urlSchema>
export type SignUpSchemaType = z.infer<typeof signUpSchema>
export type SignUpWithConfirmSchemaType = z.infer<typeof signUpWithConfirmSchema>
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>
