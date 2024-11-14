import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { createListaGuion } from '../../db/guiones/listas'

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

export const downloadFromUrl = async ({
  url,
  filename
}: {
  url: string
  filename: string
}): Promise<{ finalFilename: string; extension: string }> => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    const contentType = response.headers['content-type']
    let extension = contentType.split('/').pop() // Extracts the file extension (e.g., 'mp4', 'mp3')

    let finalFilename

    if (extension === 'mp4') {
      finalFilename = `${filename}.mp4`
    } else if (extension === 'mp3') {
      finalFilename = `${filename}.mp3`
    } else if (extension === 'octet-stream') {
      finalFilename = `${filename}.mov`
      extension = 'mov'
    } else {
      throw new Error('Invalid file extension')
    }

    const writer = createWriteStream(finalFilename)

    // Pipe the response stream into the file
    response.data.pipe(writer)

    // Return the final filename and extension after the download completes
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({ finalFilename, extension }))
      writer.on('error', (error) => {
        writer.close()
        reject(error)
      })
    })
  } catch (error) {
    throw error
  }
}
