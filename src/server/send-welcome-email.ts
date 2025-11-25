import { sendEmail } from '@/utils/send-email'

export async function sendWelcomeEmailAction(user: { name: string; email: string }) {
  try {
    const data = await sendEmail({
      to: user.email,
      subject: `Hi,${user.name} Welcome to our app!`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to our app!</h2>
        <p>Thank you for signing up to our app! We are excited to have you on board.</p>
      </div>`,
      text: `Hi,${user.name},\n\nThank you for signing up to our app! We are excited to have you on board.`,
    })
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}
