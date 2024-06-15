import { downloadVideoFromUrl, extractAudio } from '../media/handling'
import { getInstagramVideoURL } from '../media/instagram'
import { transcribeAudio } from '../openai/trancriptions'

export const transcribeInstagramVideo = async ({
  userId,
  url
}: {
  userId: string
  url: string
}) => {
  const shortcode = new URL(url).pathname.split('/')[2]
  // TODO
  // const transcriptionExists = await findTranscription({ shortcode, userId })
  // if (transcriptionExists) {
  //   console.log('Se encontro en la base de datos, enviando respuesta')
  //   return transcriptionExists.text
  // }
  const videoLink = await getInstagramVideoURL({ url })
  await downloadVideoFromUrl({ url: videoLink, filename: `${shortcode}.mp4` })
  await extractAudio({
    inputPath: `${shortcode}.mp4`,
    outputPath: `${shortcode}.mp3`
  })
  const transcription = await transcribeAudio(`${shortcode}.mp3`)
  //   const transcriptionFriendlier = friendlizeText(transcription)
  // console.log('Guardando en DB')
  // await saveTranscription({ transcription, shortcode, userId })
  // console.log('Borrando archivos')
  // await deleteInstagramFiles(shortcode)
  // console.log('Enviando respuesta')
  return { transcription, videoId: shortcode }
}
