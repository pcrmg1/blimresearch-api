import { Router } from 'express'

export const paymentRouter = Router()

paymentRouter.get('/', (req, res) => {
  return res.json({
    message: 'Hello from payment router 🚀'
  })
})

paymentRouter.post('/', async (req, res) => {
  return res.json({
    message: 'Payment created successfully'
  })
})
