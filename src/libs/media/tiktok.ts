import { unlink } from 'fs/promises'
const Tiktok = require('@tobyg74/tiktok-api-dl')

import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { transcribeAudio } from '../openai/trancriptions'
import { getTiktokVideoId } from '../../utils/parser'
import { getTiktokDataFromPost } from '../apify/tiktok'

export const transcribeTiktokVideo = async ({ url }: { url: string }) => {
  // try {
  //   const { videoId: id } = getTiktokVideoId({ url })
  //   const videoLink = await Tiktok.Downloader(url, { version: 'v2' })
  //   const filename = `${id}.mp3`
  //   console.log({ videoLink: videoLink.result, id })
  //   if (!videoLink || !videoLink.result || !videoLink.result.video)
  //     throw new Error('No se pudo descargar el video')
  //   await downloadVideoFromUrl({
  //     url: videoLink.result.video,
  //     filename: `${id}.mp4`
  //   })
  //   await extractAudio({
  //     inputPath: `${id}.mp4`,
  //     outputPath: `${id}.mp3`
  //   })
  //   const transcription = await transcribeAudio(filename)
  //   await unlink(`${id}.mp4`)
  //   await unlink(`${id}.mp3`)
  //   return { transcription, videoId: id }
  // } catch (error) {
  //   console.log({ error })
  //   if (error instanceof Error) {
  //     throw new Error(error.message)
  //   } else {
  //     throw new Error('Hubo un error procesando el video')
  //   }
  // }
  try {
    const { cost, item } = await getTiktokDataFromPost({ url })
    const { id, musicMeta } = item
    const { playUrl } = musicMeta
    const filename = `${id}.mp3`
    await downloadVideoFromUrl({
      url: playUrl,
      filename
    })
    const transcription = await transcribeAudio(filename)
    return { transcription, videoId: id, cost }
  } catch (error) {
    console.log({ error })
    throw new Error('Hubo un error procesando el video')
  }
}

export const getTiktokVideoCaption = async ({ url }: { url: string }) => {
  try {
    const { videoId: id } = getTiktokVideoId({ url })
    const videoLink = await Tiktok.Downloader(url, { version: 'v1' })
    if (!videoLink || !videoLink.result || !videoLink.result.video)
      throw new Error('No se pudo descargar el video')
    return { caption: videoLink.result.video.cover[1], videoId: id }
  } catch (error) {
    console.log({ error })
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Hubo un error procesando el video')
    }
  }
}
