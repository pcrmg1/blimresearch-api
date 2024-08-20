import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { friendlifyText, improveWithAI } from '../libs/openai/friendlify'
import {
  createFriendlifiedText,
  deleteFriendlifiedTextById,
  getFriendlifiedTextCount,
  getFriendlifiedTextWithPagination
} from '../db/friendlify'
import { errorHandler } from '../utils/error'
import { QueryParamsSchema } from '../models/queryParams'

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
  const { page, limit, orderBy } = req.query
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const parsedQuery = await QueryParamsSchema.safeParseAsync({
      page: Number(page),
      limit: Number(limit),
      query: '',
      orderBy: orderBy
    })
    if (!parsedQuery.success) {
      return res.status(400).json({ message: 'Query params are not valid' })
    }
    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString
    } = parsedQuery.data
    const friendlifiedTexts = await getFriendlifiedTextWithPagination({
      limit: parsedLimit,
      page: parsedPage,
      userId,
      orderBy: parsedOrderBy
    })
    const count = await getFriendlifiedTextCount({ userId })
    const prevPage = parsedPage > 0
    const nextPage = count > parsedPage * parsedLimit
    return res.json({ data: friendlifiedTexts, count, nextPage, prevPage })
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

friendlifyRouter.post('/improveWithAI', async (req, res) => {
  const { text } = req.body
  try {
    if (!text) {
      return res.status(500).json({ error: 'Failed to friendlify text' })
    }
    const improvedText = await improveWithAI({ text })
    return res.json({ data: improvedText })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ error: 'Hubo un error procesando el texto' })
  }
})
