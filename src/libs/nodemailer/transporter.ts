import { config } from 'dotenv'
config()

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendMail({
  emailTo,
  subject,
  html
}: {
  emailTo: string
  subject: string
  html: string
}) {
  return await sgMail.send({
    to: emailTo,
    from: 'no_reply@m.blimbooster.com',
    subject,
    html
  })
}
