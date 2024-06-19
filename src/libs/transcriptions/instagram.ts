import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { getInstagramVideoURL } from '../media/instagram'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeInstagramVideo = async ({ url }: { url: string }) => {
  const shortcode = new URL(url).pathname.split('/')[2]
  const videoLink = await getInstagramVideoURL({ url })
  await downloadVideoFromUrl({ url: videoLink, filename: `${shortcode}.mp4` })
  await extractAudio({
    inputPath: `${shortcode}.mp4`,
    outputPath: `${shortcode}.mp3`
  })
  const transcription = await transcribeAudio(`${shortcode}.mp3`)
  return { transcription, videoId: shortcode }
}
