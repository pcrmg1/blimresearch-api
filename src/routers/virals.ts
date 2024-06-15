import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { LANGUAGES_FOR_QUERIES } from '../consts'
import { getTiktokVirals } from '../controller/videos/tiktok'

export const viralsRouter = Router()

viralsRouter.get('/', async (req, res) => {
  res.json({ message: 'Hello from videos router' })
})

viralsRouter.post('/findViralVideo', async (req: RequestWithToken, res) => {
  const { search, minNumberOfFans, maxDurationVideo, platform } = req.body
  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  if (!search) {
    return res.status(400).json({ error: 'search query is required' })
  }
  if (!platform) {
    return res.status(400).json({ error: 'platform is required' })
  }
  try {
    // TODO: Check if query exists
    if (platform === 'tiktok') {
      const promisesArray = LANGUAGES_FOR_QUERIES.map((language) =>
        getTiktokVirals({
          query: search as string,
          language,
          minNumberOfFans,
          userId,
          maxDurationVideo
        })
      )
      await Promise.all(promisesArray)
      return res.json({ data: 'done' })
    } else if (platform === 'instagram') {
      const data = await findViralCarrouselInstagram({
        query: search as string,
        minFollowers: minNumberOfFans ?? 1000,
        language: 'español',
        userId
      })
      return res.json({ data })
    } else {
      return res.status(400).json({ error: 'platform is invalid' })
    }
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Hubo un error con el servidor' })
    }
  }
})
