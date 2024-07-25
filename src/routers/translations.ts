import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { translateText } from '../libs/openai/translations'
import {
  createTranslation,
  deleteTranslationById,
  getTranslationByTranscriptionId,
  getTranslationsCount,
  getTranslationsWithPagination
} from '../db/translations'
import { QueryParamsSchema } from '../models/queryParams'

export const translationsRouter = Router()

translationsRouter.get('/', async (req: RequestWithToken, res) => {
  const { limit, page, orderBy } = req.query
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const parsedQuery = await QueryParamsSchema.safeParseAsync({
      page: Number(page),
      limit: Number(limit),
      query: '',
      orderBy
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
    const translations = await getTranslationsWithPagination({
      limit: parsedLimit,
      page: parsedPage,
      userId,
      orderBy: parsedOrderBy
    })
    const count = await getTranslationsCount({ userId })
    const prevPage = parsedPage > 0
    const nextPage = count > parsedPage * parsedLimit
    return res.json({ data: translations, nextPage, prevPage, count })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Failed to get translations' })
  }
})

translationsRouter.post('/translate', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const { text, language, transcriptionId } = req.body
  try {
    const existsTranslation = await getTranslationByTranscriptionId({
      language,
      transcriptionId
    })
    if (existsTranslation) {
      return res.json({ data: existsTranslation })
    }
    const translatedText = await translateText({ text, toLanguage: language })
    if (!translatedText) {
      return res.status(500).json({ message: 'Failed to translate text' })
    }
    const translation = await createTranslation({
      language,
      text: translatedText,
      userId,
      transcriptionId
    })
    return res.json({ data: translation })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Failed to translate text' })
  }
})

translationsRouter.delete(
  '/deleteById/:id',
  async (req: RequestWithToken, res) => {
    const { id } = req.params
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    try {
      await deleteTranslationById({ id })
      return res.json({ message: 'Translation deleted' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Failed to delete translation' })
    }
  }
)
