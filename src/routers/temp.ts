import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma'

export const tempRouter = Router()

const NewTempStorageSchema = z.object({
  linkA: z.string().optional(),
  linkB: z.string().optional(),
  umbralSeguidores: z.number().optional()
})

tempRouter.get('/', async (req, res) => {
  try {
    const tempStorage = await prisma.tempSeguidores.findMany()
    return res.json({ data: tempStorage })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'An error occurred' })
    }
  }
})

tempRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const tempStorage = await prisma.tempSeguidores.findUnique({
      where: {
        id
      }
    })
    if (!tempStorage) {
      return res.status(404).json({ error: 'Temp storage not found' })
    }
    return res.json({ data: tempStorage })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'An error occurred' })
    }
  }
})

tempRouter.post('/', async (req, res) => {
  const { body } = req
  try {
    const data = await NewTempStorageSchema.safeParseAsync(body)
    if (data.error) {
      return res.status(400).json({
        error: data.error.errors.map((error) => error.message)
      })
    }
    const tempCreated = await prisma.tempSeguidores.create({
      data: {
        linkA: data.data.linkA,
        linkB: data.data.linkB,
        umbralSeguidores: data.data.umbralSeguidores
      }
    })
    return res.status(201).json({ data: tempCreated })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'An error occurred' })
    }
  }
})

tempRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  try {
    const tempStorage = await prisma.tempSeguidores.findUnique({
      where: {
        id
      }
    })
    if (!tempStorage) {
      return res.status(404).json({ error: 'Temp storage not found' })
    }
    const data = await NewTempStorageSchema.safeParseAsync(body)
    if (data.error) {
      return res.status(400).json({
        error: data.error.errors.map((error) => error.message)
      })
    }
    const tempUpdated = await prisma.tempSeguidores.update({
      where: {
        id
      },
      data: {
        linkA: data.data.linkA,
        linkB: data.data.linkB,
        umbralSeguidores: data.data.umbralSeguidores
      }
    })
    return res.json({ data: tempUpdated })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'An error occurred' })
    }
  }
})

tempRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const tempStorage = await prisma.tempSeguidores.findUnique({
      where: {
        id
      }
    })
    if (!tempStorage) {
      return res.status(404).json({ error: 'Temp storage not found' })
    }
    await prisma.tempSeguidores.delete({
      where: {
        id
      }
    })
    return res.json({ data: 'Temp storage deleted' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    } else {
      return res.status(500).json({ error: 'An error occurred' })
    }
  }
})
