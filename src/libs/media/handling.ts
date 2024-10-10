import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'

export const extractAudio = ({
  inputPath,
  outputPath
}: {
  inputPath: string
  outputPath: string
}) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run()
  })
}

export const deleteInstagramFiles = async (shortcode: string) => {
  await unlink(`${shortcode}.mp4`)
  await unlink(`${shortcode}.mp3`)
  return
}

export const deleteTiktokFiles = async (shortcode: string) => {
  await unlink(shortcode)
  return
}

export const downloadVideoFromUrl = async ({
  url,
  filename
}: {
  url: string
  filename: string
}): Promise<void> => {
  const writer = createWriteStream(filename)
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', (error) => {
        writer.close()
        reject(error)
      })
    })
  } catch (error) {
    writer.close()
    throw error
  }
}
