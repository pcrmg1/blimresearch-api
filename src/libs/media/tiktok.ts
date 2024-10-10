import { unlink } from 'fs/promises'
const Tiktok = require('@tobyg74/tiktok-api-dl')

import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { transcribeAudio } from '../openai/trancriptions'
import { getTiktokVideoId } from '../../utils/parser'
import { getTiktokDataFromPost } from '../apify/tiktok'

export const transcribeTiktokVideo = async ({ url }: { url: string }) => {
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
    const { cost, item } = await getTiktokDataFromPost({ url })
    const { id, videoMeta } = item
    return { caption: videoMeta.coverUrl, videoId: id }
  } catch (error) {
    console.log({ error })
    throw new Error('Hubo un error procesando el video')
  }
}
