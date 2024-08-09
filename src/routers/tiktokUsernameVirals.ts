import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import {
  createTiktokUsernameViral,
  deleteTiktokUsernameViralList,
  deleteTiktokViralVideoByListId,
  getTiktokViralsByUserId,
  getTiktokViralsByUserIdCount,
  getTiktokViralUsernameById,
  updateTiktokUsernameViral
} from '../db/tiktokUsernameVirals'
import { errorHandler } from '../utils/error'
import { getTiktokViralListFromUsernames } from '../libs/apify/tiktok'
import { prisma } from '../db/prisma'
import { addSpentUSD, getUserById } from '../db/user'
import { QueryParamsSchema } from '../models/queryParams'
import { formatCurrencyToAddToDB } from '../utils/currency'
import { addUserCredits } from '../db/credits'
import { CREDITS_COST } from '../consts'
import { checkCreditsCost } from '../controller/credits'

export const tiktokUsernameViralsRouter = Router()

tiktokUsernameViralsRouter.get('/', async (req: RequestWithToken, res) => {
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
    const tiktokUsernameList = await getTiktokViralsByUserId({
      userId,
      limit: parsedLimit,
      page: parsedPage,
      orderBy: parsedOrderBy
    })
    // TODO:: Enviar el mail y hacer la corroboracion.
    const count = await getTiktokViralsByUserIdCount({ userId })
    const nextPage = count > Number(limit) * (Number(page) + 1)
    const prevPage = Number(page) > 0
    return res.json({ data: tiktokUsernameList, nextPage, count, prevPage })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

tiktokUsernameViralsRouter.get('/:id', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { id } = req.params
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const tiktokUsername = await getTiktokViralUsernameById({ id })
    return res.json({ data: tiktokUsername })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

tiktokUsernameViralsRouter.post('/', async (req: RequestWithToken, res) => {
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
    const listCreated = await createTiktokUsernameViral({
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

tiktokUsernameViralsRouter.delete(
  '/:id',
  async (req: RequestWithToken, res) => {
    const userId = req.userId
    const { id } = req.params
    if (!userId) {
      return res.status(401).json({ message: 'No userId' })
    }
    try {
      const tiktokUsername = await deleteTiktokUsernameViralList({ id })
      return res.json({ data: tiktokUsername, done: true })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)

tiktokUsernameViralsRouter.put('/:id', async (req: RequestWithToken, res) => {
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
    await deleteTiktokViralVideoByListId({ listId: id })
    const tiktokUsername = await updateTiktokUsernameViral({
      id,
      usernames: usernamesString,
      name: listName
    })
    return res.json({ data: tiktokUsername })
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

tiktokUsernameViralsRouter.post(
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

      const tiktokUsernameList = await getTiktokViralUsernameById({ id })

      if (!tiktokUsernameList) {
        return res.status(404).json({ message: 'No list found' })
      }

      const totalCostCredits =
        CREDITS_COST['busqueda_virales_cada_5'] *
        Math.ceil(tiktokUsernameList.usernames.length / 5)

      const { status, error } = await checkCreditsCost({
        costOfRequest: totalCostCredits,
        creditLimit: user.limiteCreditos
      })

      if (status !== 200) {
        return res.status(status).json({ error })
      }

      await deleteTiktokViralVideoByListId({
        listId: tiktokUsernameList?.id
      })
      const { cost, videos } = await getTiktokViralListFromUsernames({
        usernames: tiktokUsernameList.usernames,
        listaCreadaPorUsuario: true
      })

      const totalCost = formatCurrencyToAddToDB(cost)
      await addSpentUSD({ userId, spentUSD: totalCost })
      if (videos.length === 0) {
        return res.json({ data: [], cost })
      }

      await addUserCredits({
        userId,
        credits: totalCostCredits,
        concepto: 'busqueda_virales_cada_5'
      })

      const formattedVideosForDB = videos.map((video) => ({
        ...video,
        tiktokUsernameViralsId: id,
        platform: 'tiktok',
        userId
      }))
      await prisma.video.createMany({
        data: formattedVideosForDB
      })

      return res.json({ data: videos, totalCost })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)
