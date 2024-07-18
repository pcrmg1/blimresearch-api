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
import {
  getTiktokDataFromProfilesQuery,
  getTiktokViralProfiles
} from '../libs/apify/tiktok'
import { prisma } from '../db/prisma'
import { addSpentUSD } from '../db/user'

export const tiktokUsernameViralsRouter = Router()

tiktokUsernameViralsRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { page, limit, type } = req.query
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  try {
    const tiktokUsernameList = await getTiktokViralsByUserId({
      userId,
      limit: Number(limit) || 20,
      page: Number(page) || 0
    })
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
  const { usernames } = req.body
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
      usernames: usernamesString
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
  const { usernames } = req.body
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  if (usernames.length === 0) {
    return res.status(400).json({ message: 'No usernames' })
  }
  try {
    const usernamesString = usernames.split(',')
    console.log({ usernamesString })
    await deleteTiktokViralVideoByListId({ listId: id })
    const tiktokUsername = await updateTiktokUsernameViral({
      id,
      usernames: usernamesString
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
      const tiktokUsernameList = await getTiktokViralUsernameById({ id })
      if (!tiktokUsernameList) {
        return res.status(404).json({ message: 'No list found' })
      }
      await deleteTiktokViralVideoByListId({
        listId: tiktokUsernameList?.id
      })
      const viralVideos = await getTiktokDataFromProfilesQuery({
        profiles: tiktokUsernameList.usernames
      })
      await addSpentUSD({ userId, spentUSD: viralVideos.cost })
      return res.json({ data: viralVideos.items, cost: viralVideos.cost })
    } catch (error) {
      errorHandler(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
)
