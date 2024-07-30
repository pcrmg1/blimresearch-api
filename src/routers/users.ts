import { Router } from 'express'
import { getUserById } from '../db/user'
import { errorHandler } from '../utils/error'
import { RequestWithToken } from '../types/jwt'
import { formatCurrencyToAddToDB } from '../utils/currency'

export const usersRouter = Router()

usersRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const user = await getUserById({ userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const { password, gastos, ...rest } = user
    return res.json({
      data: { ...rest, gastos: formatCurrencyToAddToDB(gastos) }
    })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})
