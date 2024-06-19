import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { friendlifyText } from '../libs/openai/friendlify'
import {
  createFriendlifiedText,
  deleteFriendlifiedTextById,
  getFriendlifiedTextWithPagination
} from '../db/friendlify'
import { errorHandler } from '../utils/error'

export const friendlifyRouter = Router()

friendlifyRouter.post('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { text, language, transcriptionId, translationId } = req.body
  try {
    const frienlifiedText = await friendlifyText({ text })
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    if (!frienlifiedText) {
      return res.status(500).json({ error: 'Failed to friendlify text' })
    }
    const textSaved = await createFriendlifiedText({
      language,
      text: frienlifiedText,
      userId,
      transcriptionId,
      translationId
    })
    return res.json({ data: textSaved })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ error: 'Hubo un error procesando el texto' })
  }
})

friendlifyRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { page, limit } = req.query
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const friendlifiedTexts = await getFriendlifiedTextWithPagination({
      limit: Number(limit) || 20,
      page: Number(page) || 0,
      userId
    })
    return res.json({ data: friendlifiedTexts })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Failed to get texts' })
  }
})

friendlifyRouter.delete(
  '/deleteById/:id',
  async (req: RequestWithToken, res) => {
    const userId = req.userId
    const { id } = req.params
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    if (!id) {
      return res.status(400).json({ message: 'No id provided' })
    }
    try {
      await deleteFriendlifiedTextById({ id })
      return res.json({ message: 'Friendlified text deleted' })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Failed to delete text' })
    }
  }
)
