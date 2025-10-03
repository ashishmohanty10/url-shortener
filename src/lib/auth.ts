import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '../../prisma/generated/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { createAuthMiddleware } from 'better-auth/api'
import { sendPasswordResetEmail } from '@/server/send-password-reset-email'
import { sendEmailVerification } from '@/server/send-email-verification'
import { sendWelcomeEmail } from '@/server/send-welcome-email'

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
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerification({ user: user.email!, url })
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [nextCookies(), admin()],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
