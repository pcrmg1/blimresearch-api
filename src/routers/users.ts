import { Router } from 'express'
import { getUserById } from '../db/user'
import { errorHandler } from '../utils/error'
import { RequestWithToken } from '../types/jwt'

export const usersRouter = Router()

usersRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const user = await getUserById({ userId })
    return res.json({ data: user })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})
