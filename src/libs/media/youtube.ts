import youtubeDl from 'youtube-dl-exec'
import { transcribeAudio } from '../openai/trancriptions'
import { unlink } from 'fs/promises'

export const downloadVideoFromUrl = async ({ url }: { url: string }) => {
  try {
    const [_, video] = await Promise.all([
      youtubeDl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: '%(id)s.%(ext)s'
      }),
      youtubeDl(url, {
        dumpJson: true,
        skipDownload: true
      })
    ])
    const videoId: string = (video as any).id as string
    return {
      videoId: `youtube-${videoId}`,
      video,
      filename: `${videoId}.mp3`
    }
  } catch (error) {
    console.log({ error })
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Hubo un error descargando el video')
    }
  }
}

export const transcribeVideoFromYoutube = async ({ url }: { url: string }) => {
  try {
    const { videoId, filename } = await downloadVideoFromUrl({ url })
    const transcription = await transcribeAudio(filename)
    await unlink(filename)
    return { transcription, videoId }
  } catch (error) {
    console.log({ error })
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Hubo un error procesando el video')
    }
  }
}
