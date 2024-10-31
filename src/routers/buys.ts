import { Router } from 'express'
import { appendToFile } from '../utils/writeTxt'
import { generateRandomToken } from '../utils/token'
import { hashPassword } from '../utils/password'
import { prisma } from '../db/prisma'
import { generateNewUserEmail } from '../libs/nodemailer/templates/newUser'
import { sendMail } from '../libs/nodemailer/transporter'
import { config } from 'dotenv'
import { addUserCredits } from '../db/credits'

config()

export const buysRouter = Router()

buysRouter.post('/coralmujaesweb', async (req, res) => {
  const CORAL_API_KEY = process.env.CORAL_API_KEY
  const { body } = req
  try {
    if (body.API !== CORAL_API_KEY) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    await appendToFile('src/coralmujaes.txt', {
      timestamp: new Date().toISOString(),
      ...body
    })
    const randomPassword = generateRandomToken({ length: 10 })
    const hashedPassword = await hashPassword({ password: randomPassword })
    const userExists = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        role: 'User',
        name: body.nombre
      }
    })
    const newUserEmail = generateNewUserEmail({
      password: randomPassword,
      username: user.email
    })

    await addUserCredits({
      userId: user.id,
      credits: 1000,
      concepto: 'Registro de usuario'
    })

    await sendMail({
      emailTo: user.email,
      subject: 'Bienvenido a SocialBoost! 🚀',
      html: newUserEmail
    })

    return res
      .status(200)
      .json({ message: 'User created successfully', data: body })
  } catch (error) {
    console.error('Error writing to file:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})
