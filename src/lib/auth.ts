import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '../../prisma/generated/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { createAuthMiddleware } from 'better-auth/api'
import { sendPasswordResetEmail } from '@/server/send-password-reset-email'
import { sendEmailVerification } from '@/server/send-email-verification'
import { sendWelcomeEmail } from '@/server/send-welcome-email'
import { env } from './env'

const prisma = new PrismaClient()
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user: user.email!, url })
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'],
        input: false,
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerification({ user: user.email!, url })
    },
  },
  plugins: [nextCookies(), admin()],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if (ctx.path.startsWith('/sign-up')) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        }
        if (user) {
          await sendWelcomeEmail(user)
        }
      }
    }),
  },
})

export type Session = typeof auth.$Infer.Session
