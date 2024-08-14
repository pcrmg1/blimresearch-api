import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { CREDITS_COST } from '../consts'
import { getTiktokVirals } from '../controller/videos/tiktok'
import { getInstagramVirals } from '../controller/videos/instagram'
import {
  deleteViralQueryById,
  getCarruselesByUserId,
  getCarruseles,
  getViralVideos,
  getViralVideosCount,
  getViralsByQuery,
  getViralsByUserId,
  deleteViralCarruselQueryById,
  getCarruselesCount
} from '../db/virals'
import { QueryParamsSchema } from '../models/queryParams'
import { addUserCredits } from '../db/credits'
import { checkCreditsCost } from '../controller/credits'
import { getUserById } from '../db/user'
import { checkReqBody } from '../controller/videos/virals'

export const viralsRouter = Router()

viralsRouter.get('/videos/tiktok', async (req: RequestWithToken, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    const { page, limit, query, orderBy } = req.query
    if (Number(limit) === 0) {
      const videos = await getViralsByUserId({ userId })
      return res.json({ data: videos })
    }
    const numberPage = Number(page)
    const numberLimit = Number(limit)
    const parsedParams = await QueryParamsSchema.safeParseAsync({
      page: isNaN(numberPage) ? 0 : numberPage,
      limit: isNaN(numberLimit) ? 10 : numberLimit,
      query,
      orderBy
    })
    if (!parsedParams.success) {
      return res.status(400).json({ message: 'Query params are not valid' })
    }
    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString
    } = parsedParams.data

    const videos = await getViralVideos({
      page: parsedPage,
      limit: parsedLimit,
      userId,
      orderBy: parsedOrderBy,
      query: parsedQueryString,
      platform: 'tiktok'
    })
    const count = await getViralVideosCount({
      userId,
      query: parsedQueryString
    })
    const nextPage = count > parsedLimit * parsedPage + videos.length
    const prevPage = parsedPage > 0
    res.json({ data: videos, nextPage, prevPage, count })
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Hubo un error con el servidor' })
    }
  }
})

viralsRouter.get('/videos/instagram', async (req: RequestWithToken, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    const { page, limit, query, orderBy } = req.query
    if (Number(limit) === 0) {
      const videos = await getViralsByUserId({ userId })
      return res.json({ data: videos })
    }
    const numberPage = Number(page)
    const numberLimit = Number(limit)
    const parsedParams = await QueryParamsSchema.safeParseAsync({
      page: isNaN(numberPage) ? 0 : numberPage,
      limit: isNaN(numberLimit) ? 10 : numberLimit,
      query,
      orderBy
    })
    if (!parsedParams.success) {
      return res.status(400).json({ message: 'Query params are not valid' })
    }
    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString
    } = parsedParams.data

    const videos = await getViralVideos({
      page: parsedPage,
      limit: parsedLimit,
      userId,
      orderBy: parsedOrderBy,
      query: parsedQueryString,
      platform: 'instagram'
    })
    const count = await getViralVideosCount({
      userId,
      query: parsedQueryString
    })
    const nextPage = count > parsedLimit * parsedPage + videos.length
    const prevPage = parsedPage > 0
    res.json({ data: videos, nextPage, prevPage, count })
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Hubo un error con el servidor' })
    }
  }
})

viralsRouter.get('/carruseles', async (req: RequestWithToken, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    const { page, limit, query, orderBy } = req.query
    if (Number(limit) === 0) {
      const videos = await getCarruselesByUserId({ userId })
      return res.json({ data: videos })
    }

    const numberPage = Number(page)
    const numberLimit = Number(limit)
    const parsedParams = await QueryParamsSchema.safeParseAsync({
      page: isNaN(numberPage) ? 0 : numberPage,
      limit: isNaN(numberLimit) ? 10 : numberLimit,
      query,
      orderBy
    })

    if (!parsedParams.success) {
      return res.status(400).json({ message: 'Query params are not valid' })
    }
    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString
    } = parsedParams.data

    const carruseles = await getCarruseles({
      page: parsedPage,
      limit: parsedLimit,
      userId,
      orderBy: parsedOrderBy,
      query: parsedQueryString
    })
    const count = await getCarruselesCount({
      userId,
      query: parsedQueryString
    })
    const nextPage = count > parsedLimit * parsedPage + carruseles.length
    const prevPage = parsedPage > 0
    res.json({ data: carruseles, nextPage, prevPage, count })
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Hubo un error con el servidor' })
    }
  }
})

viralsRouter.post('/findViral', async (req: RequestWithToken, res) => {
  const {
    search,
    minNumberOfFans,
    maxDurationVideo,
    minDurationVideo,
    platform,
    languages
  } = req.body

  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const user = await getUserById({ userId })

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    const { status: statusReq, error: errorReq } = checkReqBody(req)
    if (statusReq !== 200) {
      console.log({ errorReq })
      return res.status(statusReq).json({ error: errorReq })
    }
    const { status, error } = checkCreditsCost({
      costOfRequest:
        platform === 'tiktok'
          ? CREDITS_COST['busqueda_tiktok'] * languages.length +
            user.creditosUsados
          : CREDITS_COST['busqueda_instagram'] * languages.length +
            user.creditosUsados,
      creditLimit: user?.limiteCreditos
    })

    if (status !== 200) {
      return res.status(status).json({ error })
    }

    if (platform === 'tiktok') {
      await addUserCredits({
        userId,
        credits: CREDITS_COST['busqueda_tiktok'] * languages.length,
        concepto: `busqueda_tiktok - ${search}`
      })
      const promisesArray = languages.map((language: string) => {
        return getTiktokVirals({
          query: search as string,
          language,
          minNumberOfFans,
          userId,
          maxDurationVideo,
          minDurationVideo
        })
      })
      await Promise.all(promisesArray)
      return res.json({ data: 'done' })
    } else if (platform === 'instagram') {
      await addUserCredits({
        userId,
        credits: CREDITS_COST['busqueda_instagram'] * languages.length,
        concepto: `busqueda_instagram - ${search}`
      })
      const promisesArray = languages.map((language: string) => {
        return getInstagramVirals({
          query: search as string,
          minFollowers: minNumberOfFans ?? 1000,
          userId,
          language
        })
      })
      await Promise.all(promisesArray)
      return res.json({ data: 'done' })
    } else {
      return res.status(400).json({ error: 'platform is invalid' })
    }
  } catch (error) {
    console.log('error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'Hubo un error con el servidor' })
    }
  }
})

viralsRouter.delete('/videos/:id', async (req: RequestWithToken, res) => {
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

viralsRouter.delete('/carruseles/:id', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'id is required' })
  }
  try {
    await deleteViralCarruselQueryById({ id })
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
