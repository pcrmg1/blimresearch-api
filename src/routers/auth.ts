import { Router } from 'express'
import { createUser, getUserByEmail } from '../db/user'
import { comparePassword, hashPassword } from '../utils/password'
import { signToken } from '../utils/token'
import { errorHandler } from '../utils/error'
import { config } from 'dotenv'
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
      return res.status(401).json({ message: 'Wrong admin password' })
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
