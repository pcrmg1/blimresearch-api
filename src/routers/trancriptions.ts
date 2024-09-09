import { Router } from 'express'
import { RequestWithToken } from '../types/jwt'
import { transcribeInstagramVideo } from '../libs/transcriptions/instagram'
import { getTiktokVideoId, transcribeTiktokVideo } from '../libs/media/tiktok'
import { transcribeImage } from '../libs/openai/trancriptions'
import { parseImageTranscription } from '../utils/transcriptions/parseImageTranscription'
import {
  createImageTranscription,
  createVideoTranscription,
  deleteTranscriptionById,
  getTranscriptionByVideoId,
  getTranscriptionsByTypeWithPagination,
  getTranscriptionsCount,
  getTranscriptionsWithPagination
} from '../db/transcriptions'
import { getCarruselImgUrls } from '../libs/media/instagram'
import { QueryParamsSchema } from '../models/queryParams'
import { z } from 'zod'
import { prisma } from '../db/prisma'

export const transcriptionsRouter = Router()

transcriptionsRouter.get('/', async (req: RequestWithToken, res) => {
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
    const { page: parsedPage, limit: parsedLimit, ...rest } = parsedQuery.data
    const count = await getTranscriptionsCount({ userId })
    const prevPage = parsedPage > 0
    const nextPage = count > parsedPage * parsedLimit
    if (type === 'video' || type === 'image') {
      const transcriptionsByType = await getTranscriptionsByTypeWithPagination({
        limit: parsedLimit,
        page: parsedPage,
        userId,
        type: type
      })
      return res.json({ data: transcriptionsByType, nextPage, prevPage, count })
    }
    const transcriptions = await getTranscriptionsWithPagination({
      limit: parsedLimit,
      page: parsedPage,
      userId
    })
    return res.json({ data: transcriptions, nextPage, prevPage, count })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Failed to get translations' })
  }
})

transcriptionsRouter.post(
  '/transcribe_video',
  async (request: RequestWithToken, response) => {
    try {
      const { url, platform, language } = request.body
      const userId = request.userId
      if (!userId) {
        return response.status(400).json({ error: 'userId is required' })
      }
      if (platform === 'instagram') {
        const { transcription, videoId } = await transcribeInstagramVideo({
          url
        })
        const transcriptionSaved = await createVideoTranscription({
          language,
          text: transcription,
          userId,
          shortcode: videoId
        })
        return response.json({ data: transcriptionSaved })
      } else if (platform === 'tiktok') {
        const { videoId } = getTiktokVideoId({ url })
        const { transcription } = await transcribeTiktokVideo({
          url
        })
        const transcriptionSaved = await createVideoTranscription({
          language,
          text: transcription,
          userId,
          shortcode: videoId
        })
        return response.json({ data: transcriptionSaved })
      } else {
        return response
          .status(400)
          .json({ error: 'No es una plataforma soportada' })
      }
    } catch (error) {
      console.log({ error })
      if (error instanceof Error) {
        return response.status(500).json({ message: error.message })
      }
      return response
        .status(500)
        .json({ message: 'There was an error processing the video' })
    }
  }
)

transcriptionsRouter.post(
  '/transcribe_carrusel',
  async (req: RequestWithToken, res) => {
    const { url } = req.body
    const userId = req.userId
    try {
      const carruselUrlFromReq = new URL(url)
      const parsedUrl = carruselUrlFromReq.origin + carruselUrlFromReq.pathname
      const existsTranscription = await prisma.carrusel.findFirst({
        where: { url: parsedUrl },
        include: { transcription: true }
      })
      if (existsTranscription) {
        return res.json({ data: existsTranscription.transcription?.text })
      }
      const carrusel = await getCarruselImgUrls(url)
      if (!userId) {
        return res.status(400).json({ message: 'No userId' })
      }
      if (!carrusel) {
        return res.status(404).json({ message: 'No se encontro el carrusel' })
      }
      const { url: carruselUrl, urlLists: carruselUrlsArr } = carrusel

      if (!carruselUrlsArr || carruselUrlsArr.length === 0) {
        return res.status(500).json({ message: 'Error al obtener carrusel' })
      }
      const transcriptionPromises = carruselUrlsArr.map(async (carrusel) => {
        return await transcribeImage({ imgUrl: carrusel })
      })
      const transcriptions = await Promise.all(transcriptionPromises)
      const checkedTranscription = await z
        .array(z.string())
        .safeParseAsync(transcriptions)
      if (checkedTranscription.error) {
        return res.status(500).json({
          message:
            'Hubo un error con el servidor, compruebe que el carrusel tiene solo imagenes, por favor'
        })
      }
      const carruselCreated = await prisma.carrusel.create({
        data: {
          url: carruselUrl,
          username: carrusel.username,
          userId,
          timestamp: new Date(),
          transcription: {
            create: {
              text: checkedTranscription.data
            }
          }
        }
      })
      return res.json({ data: transcriptions })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({
        message:
          'Hubo un error con el servidor, compruebe que el carrusel tiene solo imagenes, por favor'
      })
    }
  }
)

transcriptionsRouter.delete(
  '/deleteById/:id',
  async (request: RequestWithToken, response) => {
    const userId = request.userId
    if (!userId) {
      return response.status(400).json({ message: 'No userId' })
    }
    const { id } = request.params
    const deletedTranscription = await deleteTranscriptionById({ id })
    return response.status(200).json({ data: deletedTranscription })
  }
)
