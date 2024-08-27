import { Router } from 'express'
import { getUserById } from '../db/user'
import { errorHandler } from '../utils/error'
import { RequestWithToken } from '../types/jwt'
import { formatCurrencyToAddToDB } from '../utils/currency'
import { sendMail } from '../libs/nodemailer/transporter'

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

usersRouter.post('/support', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { text } = req.body
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const user = await getUserById({ userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const html = `El usuario ${
      user.email
    } ha abierto un ticket de soporte con el siguiente mensaje: ${text}\n
    Creditos usados del usuario: ${user.creditosUsados}\n
    Creditos restantes del usuario: ${
      user.limiteCreditos - user.creditosUsados
    }\n
    Limite de creditos del usuario: ${user.limiteCreditos}\n`
    await sendMail({
      emailTo: 'soporte@blimbooster.com',
      subject: `Support ticket - ${user.email}`,
      html
    })
    return res.json({ message: 'Support ticket sent' })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})
