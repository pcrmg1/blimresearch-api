import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

export const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER_PASS
  }
})

export const sendEmail = async ({
  emailTo,
  subject,
  html
}: {
  emailTo: string
  subject: string
  html: string
}) => {
  try {
    await transporter.sendMail({
      from: '"Blimbooster mailing service 📧" <no_reply@blimbooster.com>',
      to: emailTo,
      subject,
      html
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Error sending email')
    }
  }
}
