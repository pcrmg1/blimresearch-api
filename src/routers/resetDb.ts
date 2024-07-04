import { Router } from 'express'
import { prismaDB } from '../index'

export const resetDBRouter = Router()

resetDBRouter.post('/', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    await Promise.all([
      prismaDB.carrusel.deleteMany(),
      prismaDB.transcription.deleteMany(),
      prismaDB.translation.deleteMany(),
      prismaDB.carruselQuery.deleteMany(),
      prismaDB.friendlifiedText.deleteMany(),
      prismaDB.video.deleteMany(),
      prismaDB.videoQuery.deleteMany()
    ])
    return res.json({
      message: 'Database reseted successfully!'
    })
  } else {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
})
