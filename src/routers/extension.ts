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
import { transcribeVideoFromYoutube } from '../libs/media/youtube'
import { downloadFromUrl, extractAudio } from '../libs/media/handling'
import { transcribeAudio } from '../libs/openai/trancriptions'
import { fileExists } from '../utils/files'
import { unlink } from 'fs/promises'
import axios from 'axios'
import { createWriteStream } from 'fs'

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

extensionRouter.post('/youtube', async (req, res) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: 'url is required' })
  }
  try {
    const { transcription } = await transcribeVideoFromYoutube({ url })
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

      Contenido: ${contenidoMejorado}

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

extensionRouter.post('/mp3', async (req, res) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: 'url is required' })
  }
  const id = generateRandomNumber(0, 1000000)
  let transcription
  try {
    const filename = `${id}.mp3`
    const { finalFilename, extension } = await downloadFromUrl({
      url,
      filename: `${id}`
    })
    if (extension === 'mp4' || extension === 'mov') {
      await extractAudio({ inputPath: finalFilename, outputPath: filename })
      transcription = await transcribeAudio(filename)
      if (!transcription) {
        return res.status(400).json({ message: 'No transcription found' })
      }
    } else if (extension === 'mp3') {
      transcription = await transcribeAudio(filename)
    } else {
      return res.status(400).json({ message: 'Invalid file extension' })
    }
    return res.json({
      data: {
        transcripcion: transcription
      }
    })
  } catch (error) {
    console.log({ error })
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    if (await fileExists(`${id}.mp3`)) await unlink(`${id}.mp3`)
    if (await fileExists(`${id}.mp4`)) await unlink(`${id}.mp4`)
    if (await fileExists(`${id}.mov`)) await unlink(`${id}.mov`)
  }
})
