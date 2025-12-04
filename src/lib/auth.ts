import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { createAuthMiddleware } from 'better-auth/api'
import { sendPasswordResetEmailAction } from '@/server/send-password-reset-email'
import { sendEmailVerificationAction } from '@/server/send-email-verification'
import { sendWelcomeEmailAction } from '@/server/send-welcome-email'
import { env } from './env'
import prisma from '@/db/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmailAction({ user: user.email!, url })
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ['user', 'admin'],
        input: false,
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationAction({ user: user.email!, url })
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
          await sendWelcomeEmailAction(user)
        }
      }
    }),
  },
})

export type Session = typeof auth.$Infer.Session
