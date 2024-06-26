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
  getTranscriptionsWithPagination
} from '../db/transcriptions'

export const transcriptionsRouter = Router()

transcriptionsRouter.get('/', async (req: RequestWithToken, res) => {
  const userId = req.userId
  const { page, limit, type } = req.query
  if (!userId) {
    return res.status(401).json({ message: 'No userId' })
  }
  if (type === 'video' || type === 'image') {
    const transcriptionsByType = await getTranscriptionsByTypeWithPagination({
      limit: Number(limit) || 20,
      page: Number(page) || 0,
      userId,
      type: type
    })
    return res.json({ data: transcriptionsByType })
  }
  const transcriptions = await getTranscriptionsWithPagination({
    limit: Number(limit) || 20,
    page: Number(page) || 0,
    userId
  })
  return res.json({ data: transcriptions })
})

transcriptionsRouter.post(
  '/transcribe_video',
  async (request: RequestWithToken, response) => {
    try {
      const { url, platform, language } = request.body
      const userId = request.userId
      console.log({ url, platform, language, userId })
      if (!userId) {
        return response.status(400).json({ error: 'userId is required' })
      }
      console.log('URL recibida: ', url)
      if (platform === 'instagram') {
        const { transcription, videoId } = await transcribeInstagramVideo({
          url
        })
        const transcriptionsExists = await getTranscriptionByVideoId({
          shortcode: videoId
        })
        if (transcriptionsExists) {
          console.log('Transcripcion ya existe en la base de datos, enviando')
          return response.json({ data: transcriptionsExists })
        }
        const transcriptionSaved = await createVideoTranscription({
          language,
          text: transcription,
          userId,
          shortcode: videoId
        })
        return response.json({ data: transcriptionSaved })
      } else if (platform === 'tiktok') {
        const { videoId } = getTiktokVideoId({ url })
        const transcriptionsExists = await getTranscriptionByVideoId({
          shortcode: videoId
        })
        if (transcriptionsExists) {
          console.log('Transcripcion ya existe en la base de datos, enviando')
          return response.json({ data: transcriptionsExists })
        }
        const { transcription } = await transcribeTiktokVideo({
          url,
          userId
        })
        console.log('Guardando en base de datos')
        const transcriptionSaved = await createVideoTranscription({
          language,
          text: transcription,
          userId,
          shortcode: videoId
        })
        console.log(transcriptionSaved)
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
  '/transcribe_image',
  async (request: RequestWithToken, response) => {
    const { imgUrl, hashtagsToCompare, language } = request.body
    const userId = request.userId
    if (!userId) {
      return response.status(400).json({ message: 'userId is required' })
    }
    try {
      const transcription = await transcribeImage({ imgUrl, hashtagsToCompare })
      if (!transcription || transcription === null) {
        return response
          .status(500)
          .json({ message: 'Hubo un error con el servidor' })
      }
      const data = parseImageTranscription({ transcription })
      const savedImageTranscription = await createImageTranscription({
        language,
        text: data,
        userId
      })
      return response.json({ data: savedImageTranscription })
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Hubo un error con el sevidor' })
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
