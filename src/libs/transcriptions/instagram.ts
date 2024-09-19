import { getInstagramVideoId } from '../../utils/parser'
import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { getInstagramVideoURL } from '../media/instagram'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeInstagramVideo = async ({ url }: { url: string }) => {
  const { shortcode } = getInstagramVideoId({ url })
  const videoLink = await getInstagramVideoURL({ url })
  if (!videoLink) {
    throw new Error('No se pudo obtener el video de la URL')
  }
  await downloadVideoFromUrl({ url: videoLink, filename: `${shortcode}.mp4` })
  await extractAudio({
    inputPath: `${shortcode}.mp4`,
    outputPath: `${shortcode}.mp3`
  })
  const transcription = await transcribeAudio(`${shortcode}.mp3`)
  return { transcription, videoId: shortcode }
}
