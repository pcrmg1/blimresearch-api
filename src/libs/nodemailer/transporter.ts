import { config } from 'dotenv'
config()

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'agustinmaillet47@gmail.com', // Change to your recipient
  from: 'no_reply@m.blimbooster.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
}

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
