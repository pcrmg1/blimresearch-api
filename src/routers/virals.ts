import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { LANGUAGES_FOR_QUERIES } from '../consts'
import { getTiktokVirals } from '../controller/videos/tiktok'
import { getInstagramVirals } from '../controller/videos/instagram'
import {
  deleteViralQueryById,
  getCarruseles,
  getVirals,
  getViralsByQuery
} from '../db/virals'

export const viralsRouter = Router()

viralsRouter.get('/videos', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const { page, limit } = req.query

  const videos = await getVirals({
    page: Number(page) || 0,
    limit: Number(limit) || 20,
    userId
  })

  res.json({ data: videos })
})

viralsRouter.get('/carruseles', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const { page, limit } = req.query

  const videos = await getCarruseles({
    page: Number(page) || 0,
    limit: Number(limit) || 20,
    userId
  })

  res.json({ data: videos })
})

viralsRouter.post('/findViralVideo', async (req: RequestWithToken, res) => {
  const { search, minNumberOfFans, maxDurationVideo, platform, language } =
    req.body
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

  const isPlatformValid = ['tiktok', 'instagram'].includes(platform)
  if (!isPlatformValid) {
    return res.status(400).json({ error: 'platform is invalid' })
  }
  const existsQuery = await getViralsByQuery({
    query: search as string,
    userId,
    platform
  })
  if (existsQuery.length > 0) {
    return res
      .status(400)
      .json({ error: 'query already exists', data: existsQuery })
  }

  try {
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
      const data = await getInstagramVirals({
        query: search as string,
        minFollowers: minNumberOfFans ?? 1000,
        minLikes: 1000,
        userId,
        language
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

viralsRouter.delete('/:id', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'id is required' })
  }

  try {
    await deleteViralQueryById({ id })
    res.json({ data: 'done' })
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Hubo un error con el servidor' })
    }
  }
})
