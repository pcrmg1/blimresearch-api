import { Router } from 'express'
import { generateTopicsQueries } from '../libs/openai/topics'
import { transcribeTiktokVideo } from '../libs/media/tiktok'
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
    console.log({ transcription })
    const guionMejorado = await mejorarGuion({ guion: transcription })
    console.log({ guionMejorado })
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
    console.log({ hookMejorado, ctaMejorado, contenidoMejorado })
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
