import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import {
  createInstagramUsernameViral,
  deleteInstagramUsernameViralList,
  deleteInstagramViralVideoByListId,
  getInstagramViralsByUserId,
  getInstagramViralsByUserIdCount,
  getInstagramViralUsernameById,
  updateInstagramUsernameViral
} from '../db/instagramUsernameVirals'
import { errorHandler } from '../utils/error'
import { prisma } from '../db/prisma'
import { addSpentUSD, getUserById } from '../db/user'
import { QueryParamsSchema } from '../models/queryParams'
import { formatCurrencyToAddToDB } from '../utils/currency'
import { addUserCredits } from '../db/credits'
import { CREDITS_COST } from '../consts'
import { checkCreditsCost } from '../controller/credits'
import { getInstagramViralsFromUsernamesList } from '../controller/instagramUsernamesViralsList'
import { Prisma, PrismaClient } from '@prisma/client'

export const instagramUsernameViralsRouter = Router()

instagramUsernameViralsRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { page, limit, type, orderBy } = req.query
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
    const instagramUsernameList = await getInstagramViralsByUserId({
      userId,
      limit: parsedLimit,
      page: parsedPage,
      orderBy: parsedOrderBy
    })
    // TODO:: Enviar el mail y hacer la corroboracion.
    const count = await getInstagramViralsByUserIdCount({ userId })
    const nextPage = count > Number(limit) * (Number(page) + 1)
    const prevPage = Number(page) > 0
    return res.json({ data: instagramUsernameList, nextPage, count, prevPage })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

instagramUsernameViralsRouter.get(
  '/:id',
  async (req: RequestWithToken, res) => {
    const userId = req.userId
    const { id } = req.params
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    try {
      const instagramUsername = await getInstagramViralUsernameById({ id })
      return res.json({ data: instagramUsername })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)

instagramUsernameViralsRouter.post('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { usernames, listName } = req.body
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  if (usernames.length === 0) {
    return res.status(400).json({ message: 'No usernames' })
  }
  try {
    const usernamesString = usernames.split(',')
    const listCreated = await createInstagramUsernameViral({
      userId,
      usernames: usernamesString,
      name: listName
    })
    return res.json({ data: listCreated })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

instagramUsernameViralsRouter.delete(
  '/:id',
  async (req: RequestWithToken, res) => {
    const userId = req.userId
    const { id } = req.params
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    try {
      const instagramUsername = await deleteInstagramUsernameViralList({ id })
      return res.json({ data: instagramUsername, done: true })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)

instagramUsernameViralsRouter.put(
  '/:id',
  async (req: RequestWithToken, res) => {
    const userId = req.userId
    const { id } = req.params
    const { usernames, listName } = req.body
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    if (usernames.length === 0) {
      return res.status(400).json({ message: 'No usernames' })
    }
    try {
      const usernamesString = usernames.split(',')
      await deleteInstagramViralVideoByListId({ listId: id })
      const instagramUsername = await updateInstagramUsernameViral({
        id,
        usernames: usernamesString,
        name: listName
      })
      return res.json({ data: instagramUsername })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)

instagramUsernameViralsRouter.post(
  '/findVirals/:id',
  async (req: RequestWithToken, res) => {
    const userId = req.userId
    const { id } = req.params
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    try {
      const user = await getUserById({ userId })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const instagramUsernameList = await getInstagramViralUsernameById({ id })

      if (!instagramUsernameList) {
        return res.status(404).json({ message: 'No list found' })
      }

      const totalCostCredits =
        CREDITS_COST['busqueda_virales_cada_5_ig'] *
        Math.ceil(instagramUsernameList.usernames.length / 5)

      const { status, error } = await checkCreditsCost({
        costOfRequest: totalCostCredits,
        creditLimit: user.limiteCreditos
      })

      if (status !== 200) {
        return res.status(status).json({ error })
      }

      await deleteInstagramViralVideoByListId({
        listId: instagramUsernameList?.id
      })

      console.log('here')

      const {
        cost,
        totalSidecars: carruseles,
        totalVideos: videos
      } = await getInstagramViralsFromUsernamesList({
        usernames: instagramUsernameList.usernames,
        userId
      })

      console.log({ cost, carruseles, videos })

      const totalCost = formatCurrencyToAddToDB(cost)

      console.log({ totalCost })

      await addSpentUSD({ userId, spentUSD: totalCost })

      if (videos.length === 0 && carruseles.length === 0) {
        return res.status(400).json({ message: 'No virals found' })
      }

      await addUserCredits({
        userId,
        credits: totalCostCredits,
        concepto: 'busqueda_virales_cada_5_instagram'
      })
      const formattedCarrouseles: Prisma.CarruselCreateManyInput[] =
        carruseles.map(({ username, url, likesCount, images }) => ({
          url,
          likes: likesCount,
          imagesUrl: images,
          username,
          instagramUsernameViralsId: id,
          userId
        }))

      const formattedVideos: Prisma.VideoCreateManyInput[] = videos.map(
        ({ username, url, likesCount, videoViewCount }) => ({
          url,
          videoHearts: likesCount,
          videoViews: videoViewCount,
          username,
          instagramUsernameViralsId: id,
          platform: 'instagram',
          userId
        })
      )
      const videosData = await prisma.video.createMany({
        data: formattedVideos
      })

      const carruselesData = await prisma.carrusel.createMany({
        data: formattedCarrouseles
      })

      console.log({ videosData, carruselesData })

      return res.json({ data: { videosData, carruselesData }, totalCost })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)
