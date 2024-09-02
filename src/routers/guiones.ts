import { Router } from 'express'
import { QueryParamsSchema } from '../models/queryParams'
import { RequestWithToken } from '../types/jwt'
import { errorHandler } from '../utils/error'
import { NewGuionSchema } from '../models/guion'
import {
  createGuion,
  getGuionById,
  getGuionesCount,
  getGuionesWithPagination,
  updateGuion
} from '../db/guiones/guion'

export const guionesRouter = Router()

guionesRouter.get('/', async (req: RequestWithToken, res) => {
  const { page, limit, orderBy, order } = req.query
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const parsedQueryData = await QueryParamsSchema.safeParseAsync({
      page: isNaN(Number(page)) ? 0 : Number(page),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
      order,
      orderBy
    })
    if (!parsedQueryData.success) {
      return res.status(400).json({ message: parsedQueryData.error })
    }
    const guiones = await getGuionesWithPagination({
      ...parsedQueryData.data,
      userId
    })
    const { page: parsedPage, limit: parsedLimit } = parsedQueryData.data
    const guionesCount = await getGuionesCount({ userId })
    const prevPage = parsedPage < 1 ? 0 : parsedPage - 1
    const nextPage =
      parsedPage * parsedLimit + guiones.length < guionesCount
        ? parsedPage + 1
        : parsedPage
    return res.json({ data: guiones, prevPage, nextPage, count: guionesCount })
  } catch (error) {
    errorHandler(error)
    res.status(500).json('Internal server error')
  }
})

guionesRouter.get('/:id', async (req: RequestWithToken, res) => {
  const { id } = req.params
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const guion = await getGuionById({ id, userId })
    if (guion) {
      res.json({ data: guion })
    } else {
      res.status(404).json({ message: 'Guion not found' })
    }
  } catch (error) {
    errorHandler(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

guionesRouter.post('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const parsedGuion = await NewGuionSchema.safeParseAsync(req.body)
    if (!parsedGuion.success) {
      return res.status(400).json({ message: parsedGuion.error })
    }
    const guion = await createGuion({
      ...parsedGuion.data,
      userId
    })
    res.json({ data: guion })
  } catch (error) {
    errorHandler(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

guionesRouter.put('/:id', async (req: RequestWithToken, res) => {
  const { id } = req.params
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const parsedGuion = await NewGuionSchema.safeParseAsync(req.body)
    if (!parsedGuion.success) {
      return res.status(400).json({ message: parsedGuion.error })
    }
    const guion = await updateGuion({
      ...parsedGuion.data,
      id,
      userId
    })
    res.json({ data: guion })
  } catch (error) {
    errorHandler(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
