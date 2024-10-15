import { unlink } from 'fs/promises'

import { getTiktokDataFromPost, getTiktokDataFromPost_2 } from '../apify/tiktok'
import { downloadFromUrl, extractAudio } from '../media/handling'
import { transcribeAudio } from '../openai/trancriptions'
import { fileExists } from '../../utils/files'

export const transcribeTiktokVideo = async ({ url }: { url: string }) => {
  let filename = ''
  let transcription = ''
  try {
    const firstResult = await getTiktokDataFromPost_2({ url })
    if (firstResult && firstResult.item.video.url) {
      const {
        video: { url: videoUrl }
      } = firstResult.item
      const id = firstResult.item.id
      const outputMp3 = `${firstResult.item.id}.mp3`
      const { finalFilename } = await downloadFromUrl({
        url: videoUrl,
        filename: id
      })
      filename = finalFilename
      await extractAudio({
        inputPath: filename,
        outputPath: outputMp3
      })
      transcription = await transcribeAudio(outputMp3)
      if (await fileExists(outputMp3)) await unlink(outputMp3)
      return {
        transcription,
        videoId: firstResult.item.id,
        cost: firstResult.cost
      }
    } else {
      const { cost, item } = await getTiktokDataFromPost({ url })
      if (item && item.videoMeta.downloadAddr) {
        const { id, musicMeta } = item
        const { playUrl } = musicMeta
        const { extension, finalFilename } = await downloadFromUrl({
          url: playUrl,
          filename: id
        })
        if (extension === 'mp4') {
          filename = `${id}.mp3`
          extractAudio({
            inputPath: finalFilename,
            outputPath: filename
          })
          transcription = await transcribeAudio(filename)
        } else if (extension === 'mp3') {
          filename = finalFilename
          transcription = await transcribeAudio(filename)
        }
        return { transcription, videoId: id, cost }
      }
    }
  } catch (error) {
    console.log({ error })
    throw new Error('Hubo un error procesando el video')
  } finally {
    if (await fileExists(filename)) await unlink(filename)
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
