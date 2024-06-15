import Tiktok from 'tiktokapi-src'

import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeTiktokVideo = async ({
  userId,
  url
}: {
  userId: string
  url: string
}) => {
  try {
    const id = url?.split('/')[5] as string
    // const transcriptionExists = await findTranscription({
    //   shortcode: id,
    //   userId
    // })
    // if (transcriptionExists) {
    //   console.log('Se encontro en la base de datos, enviando respuesta')
    //   return transcriptionExists.text
    // }
    const videoLink = await Tiktok.Downloader(url, { version: 'v3' })
    console.log({ videoLink })
    const filename = `${id}.mp3`
    console.log('Descargando video ', filename)
    if (!videoLink || !videoLink.result || !videoLink.result.video2)
      throw new Error('No se pudo descargar el video')
    await downloadVideoFromUrl({
      url: videoLink.result.video2,
      filename: `${id}.mp4`
    })
    await extractAudio({
      inputPath: `${id}.mp4`,
      outputPath: `${id}.mp3`
    })
    const transcription = await transcribeAudio(filename)
    // const transcriptionFriendlier = await friendlifyText({
    //   text: transcription
    // })
    // return transcriptionFriendlier
    // console.log('Guardando en DB')
    // await saveTranscription({ transcription, shortcode: id, userId })
    // console.log('Borrando archivos')
    // await deleteInstagramFiles(id)
    // console.log('Enviando respuesta')
    return { transcription, videoId: id }
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Hubo un error procesando el video')
    }
  }
}
