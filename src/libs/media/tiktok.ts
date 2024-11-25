import { unlink } from 'fs/promises'

import { fileExists } from '../../utils/files'
import { getTiktokDataFromPost, getTiktokDataFromPost_3 } from '../apify/tiktok'
import { downloadFromUrl, extractAudio } from '../media/handling'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeTiktokVideo = async ({ url }: { url: string }) => {
  let filename = ''
  let transcription = ''
  try {
    const firstResult = await getTiktokDataFromPost_3({ url })
    if (firstResult && firstResult.item.video.play_addr) {
      const videoUrl = firstResult.item.video.play_addr.url_list[0]
      console.log('Entro en el primero', videoUrl)
      const id = firstResult.item.aweme_id
      const outputMp3 = `${id}.mp3`
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
        videoId: id as string,
        cost: firstResult.cost
      }
    } else {
      const { cost, item } = await getTiktokDataFromPost({ url })
      console.log({ item })
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
          if (await fileExists(finalFilename)) await unlink(finalFilename)
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
