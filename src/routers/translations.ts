import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import prismaDB from '../db/prisma'
import { translateText } from '../libs/openai/translations'
import { createTranslation, deleteTranslationById } from '../db/translations'

export const translationsRouter = Router()

translationsRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const translations = await prismaDB.translation.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return res.json({ data: translations })
})

translationsRouter.post('/translate', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const { text, language, transcriptionId } = req.body
  try {
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

translationsRouter.delete('/:id', async (req: RequestWithToken, res) => {
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
})
