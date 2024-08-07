import { unlink } from 'fs/promises'
const Tiktok = require('@tobyg74/tiktok-api-dl')

import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeTiktokVideo = async ({ url }: { url: string }) => {
  try {
    const id = url?.split('/')[5].split('?')[0] as string
    const videoLink = await Tiktok.Downloader(url, { version: 'v3' })
    console.log({ videoLink })
    const filename = `${id}.mp3`
    if (!videoLink || !videoLink.result || !videoLink.result.video1)
      throw new Error('No se pudo descargar el video')
    console.log('Descargando video ', filename)
    await downloadVideoFromUrl({
      url: videoLink.result.video1,
      filename: `${id}.mp4`
    })
    console.log('Video descargado, extrayendo audio')
    await extractAudio({
      inputPath: `${id}.mp4`,
      outputPath: `${id}.mp3`
    })
    console.log('Audio extraido')
    const transcription = await transcribeAudio(filename)
    await unlink(`${id}.mp4`)
    await unlink(`${id}.mp3`)
    return { transcription, videoId: id }
  } catch (error) {
    console.log({ error })
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Hubo un error procesando el video')
    }
  }
}

export const getTiktokVideoId = ({ url }: { url: string }) => {
  const id = url?.split('/')[5].split('?')[0] as string
  return { videoId: id }
}
