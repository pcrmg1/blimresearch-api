import { Router } from 'express'
import { prisma } from '../db/prisma'
import { QueryParamsSchema } from '../models/queryParams'
import { errorHandler } from '../utils/error'
import { RequestWithToken } from '../types/jwt'
import {
  createListaGuion,
  getListaGuionById,
  getListaGuionesCount,
  getListaGuionesWithPagination,
  updateListaGuion
} from '../db/guiones/listas'

export const listaGuionesRouter = Router()

listaGuionesRouter.get('/', async (req: RequestWithToken, res) => {
  const { page, limit, orderBy, order } = req.query
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const parsedQueryData = await QueryParamsSchema.safeParseAsync({
      page: isNaN(Number(page)) ? 0 : Number(page),
      limit: isNaN(Number(limit)) ? 10 : Number(limit),
      order,
      orderBy
    })
    if (!parsedQueryData.success) {
      return res.status(400).json({ message: parsedQueryData.error })
    }
    const listaGuiones = await getListaGuionesWithPagination({
      ...parsedQueryData.data,
      userId
    })
    const { page: parsedPage, limit: parsedLimit } = parsedQueryData.data
    const guionesCount = await getListaGuionesCount({ userId })
    const prevPage = parsedPage < 1 ? 0 : parsedPage - 1
    const nextPage =
      parsedPage * parsedLimit + listaGuiones.length < guionesCount
        ? parsedPage + 1
        : parsedPage
    return res.json({
      data: listaGuiones,
      prevPage,
      nextPage,
      count: guionesCount
    })
  } catch (error) {
    errorHandler(error)
    res.status(500).json('Internal server error')
  }
})

listaGuionesRouter.get('/:id', async (req: RequestWithToken, res) => {
  const { id } = req.params
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const guion = await getListaGuionById({ id, userId })
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

listaGuionesRouter.post('/', async (req: RequestWithToken, res) => {
  const { nombre } = req.body
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    if (!nombre || nombre === '' || typeof nombre !== 'string') {
      return res
        .status(400)
        .json({ message: 'Nombre is required and must be a string' })
    }
    const newGuion = await createListaGuion({ nombre, userId })
    res.json({ data: newGuion })
  } catch (error) {
    errorHandler(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

listaGuionesRouter.post('/guion', async (req: RequestWithToken, res) => {
  const { guionId, listaGuionId } = req.body
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  if (!guionId || !listaGuionId) {
    return res
      .status(400)
      .json({ message: 'GuionId and listaGuionId are required' })
  }
  try {
    const guionActualizado = await prisma.guion.update({
      where: {
        id: guionId
      },
      data: {
        listaGuion: { connect: { id: listaGuionId } }
      }
    })
    return guionActualizado
  } catch (error) {
    errorHandler(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

listaGuionesRouter.put('/:id', async (req: RequestWithToken, res) => {
  const { id } = req.params
  const { nombre } = req.body
  const userId = req.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    if (!nombre) {
      return res.status(400).json({ message: 'Nombre is required' })
    }
    const updatedGuion = await updateListaGuion({ id, nombre, userId })
    res.json({ data: updatedGuion })
  } catch (error) {
    errorHandler(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
