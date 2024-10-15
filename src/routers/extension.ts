import { Router } from 'express'
import { generateTopicsQueries } from '../libs/openai/topics'
import { mejorarGuion } from '../libs/openai/guiones'
import {
  improveCTAComentarios,
  improveCTACompartidos,
  improveCTASeguidores,
  improveHook,
  improveContenidoConPromesa,
  improveContenidoSinPromesa
} from '../libs/openai/friendlify'
import { generateRandomNumber } from '../utils/random'
import { transcribeTiktokVideo } from '../libs/media/tiktok'

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
    const videoTranscript = await transcribeTiktokVideo({
      url
    })
    if (!videoTranscript) {
      return res.status(400).json({ message: 'No video found' })
    }
    const { cost, transcription } = videoTranscript
    const guionMejorado = await mejorarGuion({ guion: transcription })
    if (!guionMejorado) {
      return res.status(400).json({ message: 'No guion found' })
    }
    const randomIndex = generateRandomNumber(0, 100)
    let mejorarCTAFunction
    let mejorarContenido
    if (randomIndex < 35) {
      mejorarCTAFunction = improveCTAComentarios
    } else if (randomIndex < 85) {
      mejorarCTAFunction = improveCTASeguidores
    } else {
      mejorarCTAFunction = improveCTACompartidos
    }
    if (randomIndex < 60) {
      mejorarContenido = improveContenidoSinPromesa
    } else {
      mejorarContenido = improveContenidoConPromesa
    }
    const [hookMejorado, ctaMejorado, contenidoMejorado] = await Promise.all([
      improveHook({
        contenido: guionMejorado?.contenido,
        cta: guionMejorado?.cta
      }),
      mejorarCTAFunction({
        contenido: guionMejorado?.contenido,
        hook: guionMejorado?.hook,
        cta: guionMejorado?.cta
      }),
      mejorarContenido({
        contenido: guionMejorado?.contenido,
        cta: guionMejorado?.cta,
        hook: guionMejorado?.hook
      })
    ])
    return res.json({
      data: {
        guion: `
      Hook: ${hookMejorado}

      Guion: ${contenidoMejorado}

      CTA: ${ctaMejorado}
      `,
        transcripcion: transcription
      }
    })
  } catch (error) {
    console.log({ error })
    return res.status(500).json({ message: 'Internal server error' })
  }
})
