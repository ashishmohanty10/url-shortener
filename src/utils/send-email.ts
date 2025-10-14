import { Resend } from 'resend'
import { env } from '@/lib/env'

const resend = new Resend(env.RESEND_API_KEY!)
const FROM_EMAIL = env.RESEND_FROM_EMAIL!

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Email sending failed:', error)
      throw new Error(error.message)
    }

    return data
  } catch (err) {
    console.error('Unexpected error sending email:', err)
    throw err
  }
}
