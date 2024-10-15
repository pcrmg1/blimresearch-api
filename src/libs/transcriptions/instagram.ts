import { getInstagramVideoId } from '../../utils/parser'
import { downloadFromUrl, extractAudio } from '../media/handling'
import { getInstagramVideoURL } from '../media/instagram'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeInstagramVideo = async ({ url }: { url: string }) => {
  const { shortcode } = getInstagramVideoId({ url })
  const videoLink = await getInstagramVideoURL({ url })
  if (!videoLink) {
    throw new Error('No se pudo obtener el video de la URL')
  }
  const { finalFilename } = await downloadFromUrl({
    url: videoLink,
    filename: shortcode
  })
  await extractAudio({
    inputPath: finalFilename,
    outputPath: `${shortcode}.mp3`
  })
  const transcription = await transcribeAudio(`${shortcode}.mp3`)
  return { transcription, videoId: shortcode }
}
