import { Router } from 'express'
import { generateTopicsQueries } from '../libs/openai/topics'
import { transcribeTiktokVideo } from '../libs/media/tiktok'
import { mejorarGuion } from '../libs/openai/guiones'
import { improveHook } from '../libs/openai/friendlify'

export const extensionRouter = Router()

extensionRouter.post('/topics', async (req, res) => {
  const { beneficios, problemas, ejemplos } = req.body
  try {
    const queryTopics = await generateTopicsQueries({
      beneficios,
      problemas,
      ejemplos
    })
    if (!queryTopics) {
      return res.status(400).json({ message: 'No topics found' })
    }
    const topicUrls = queryTopics.topics.slice(0, 20).map((query) => {
      const tiktokUrl = new URL('https://www.tiktok.com/search')
      tiktokUrl.searchParams.append('q', query)
      return { url: tiktokUrl.toString(), query }
    })
    return res.json({
      data: {
        topicUrls
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

extensionRouter.post('/tiktok', async (req, res) => {
  const { url } = req.body
  try {
    const { transcription, videoId } = await transcribeTiktokVideo({
      url
    })
    const guionMejorado = await mejorarGuion({ guion: transcription })
    if (!guionMejorado) {
      return res.status(400).json({ message: 'No guion found' })
    }
    const hookMejorado = await improveHook({
      contenido: guionMejorado?.contenido,
      cta: guionMejorado?.cta
    })
    return res.json({
      data: {
        guion: `
      Hook: ${hookMejorado}

      Guion: ${guionMejorado.contenido}

      CTA: ${guionMejorado.cta}
      `,
        transcripcion: transcription
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})
