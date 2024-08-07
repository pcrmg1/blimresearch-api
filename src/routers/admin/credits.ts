import { Router, Request, Response } from 'express'
import {
  addUserCredits,
  modifyCreditLimit,
  modifyUserCredits
} from '../../db/credits'

export const adminCreditsRouter = Router()

interface CreditsRequest extends Request {
  params: {
    id: string
  }
}

adminCreditsRouter.patch('/', async (req: CreditsRequest, res: Response) => {
  // Modifica los creditos de un usuario seteando el valor
  const { id } = req.params
  const { credits, concepto } = req.body
  try {
    const user = await modifyUserCredits({ userId: id, credits, concepto })
    return res.json({ data: user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminCreditsRouter.put('/', async (req: CreditsRequest, res: Response) => {
  // Modifica los creditos de un usuario incrementando el valor
  const { id } = req.params
  const { credits, concepto } = req.body
  try {
    const user = await addUserCredits({ userId: id, credits, concepto })
    return res.json({ data: user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminCreditsRouter.post(
  '/limit',
  // Cambia el limite maximo de uso de creditos
  async (req: CreditsRequest, res: Response) => {
    const { id } = req.params
    const { credits } = req.body
    try {
      const user = await modifyCreditLimit({ userId: id, newCredits: credits })
      return res.json({ data: user })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)
