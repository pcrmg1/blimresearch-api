import { Router } from 'express'
import { createUser, getUserByEmail } from '../db/user'
import { comparePassword, hashPassword } from '../utils/password'
import { generateRandomToken, signToken } from '../utils/token'
import { errorHandler } from '../utils/error'
import { config } from 'dotenv'
import { DateTime } from 'luxon'
import { prisma } from '../db/prisma'
import { sendMail } from '../libs/nodemailer/transporter'
import {
  generatePasswordUpdatedEmail,
  generateResetPasswordEmail
} from '../libs/nodemailer/templates/resetPassword'

config()

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' })
    }
    const user = await getUserByEmail({ email })
    if (!user) {
      return res.status(401).json({ message: 'Wrong credentials' })
    }
    if (password === process.env.ADMIN_PASSWORD) {
      const token = signToken({ role: user.role, email, userId: user.id })
      return res.status(200).json({
        token,
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.role
      })
    }
    const isPasswordCorrect = await comparePassword({
      password,
      hash: user.password
    })
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Wrong credentials' })
    }
    const token = signToken({ role: user.role, email, userId: user.id })
    return res.status(200).json({
      token,
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role
    })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

authRouter.post('/register', async (req, res) => {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD
    const { email, password, name, adminPasswordFromReq, role } = req.body
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: 'Email, password and name are required' })
    }
    if (adminPasswordFromReq !== adminPassword) {
      return res.status(401).json({ message: 'Wrong credentials' })
    }
    if (['Admin', 'User'].includes(role) === false) {
      return res
        .status(400)
        .json({ message: 'Role must be either Admin or User' })
    }
    const user = await getUserByEmail({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const passwordHash = await hashPassword({ password })
    const userCreated = await createUser({
      email,
      passwordHash,
      name,
      role
    })
    return res.status(201).json(userCreated)
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

authRouter.post('/forgotPassword', async (req, res) => {
  try {
    const { email } = req.body
    const user = await getUserByEmail({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const token = generateRandomToken({ length: 64 })
    const expirationDate = DateTime.now().plus({ hours: 1 }).toJSDate()
    const userUpdated = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        changePasswordToken: token,
        changePasswordExpire: expirationDate
      }
    })
    const href = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`
    const html = generateResetPasswordEmail({ href, email })
    await sendMail({
      emailTo: email,
      subject: 'Reset password',
      html
    })
    return res.json({ message: 'Token generated successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error })
  }
})

authRouter.post('/resetPassword', async (req, res) => {
  const { newPassword, token } = req.body
  if (!newPassword || !token) {
    return res.status(400).json({ message: 'Password and token are required' })
  }
  if (typeof token !== 'string') {
    return res.status(400).json({ message: 'Token must be a string' })
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        changePasswordToken: token
      }
    })
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' })
    }
    if (
      user.changePasswordToken === null ||
      user.changePasswordExpire === null ||
      user.changePasswordExpire < new Date()
    ) {
      return res.status(400).json({ message: 'Token expired' })
    }
    const passwordHash = await hashPassword({ password: newPassword })
    const userUpdated = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: passwordHash,
        changePasswordToken: null,
        changePasswordExpire: null
      }
    })
    const html = generatePasswordUpdatedEmail()
    await sendMail({
      emailTo: user.email,
      subject: 'Password updated',
      html
    })
    return res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error })
  }
})
