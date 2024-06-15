import { Router } from 'express'
import { NewUserSchema } from '../../models/user'
import { createUser } from '../../db/user'
import { hashPassword } from '../../utils/password'

export const usersRouter = Router()

usersRouter.post('/createUser', async (req, res) => {
  try {
    const { email, password, role, name } = req.body
    const parsedCredentials = await NewUserSchema.safeParseAsync({
      email,
      password,
      role,
      name
    })
    if (!parsedCredentials.success) {
      return res.status(400).json({
        message: 'Credenciales no validas para crear el usuario'
      })
    }
    const hashedPassword = await hashPassword({ password })
    const user = createUser({ email, passwordHash: hashedPassword, role, name })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})
