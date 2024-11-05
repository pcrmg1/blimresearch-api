import { Router } from 'express'
import Ffmpeg from 'fluent-ffmpeg'
import { mkdir, unlink, writeFile } from 'fs/promises'
import multer from 'multer'
import { join } from 'path'
import {
  detectHookEnd,
  transcribeAudioVerbose
} from '../libs/openai/trancriptions'
import { Silence } from '../libs/openai/video-maker'
import { fileExists } from '../utils/files'
import {
  generateImagePromptFromTranscription,
  imageFromTranscription
} from '../libs/openai/images'

export const videoGenerator = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

videoGenerator.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.')
  }
  if (req.file.mimetype !== 'audio/mpeg') {
    return res.status(400).send('Only mp3 files are allowed.')
  }

  try {
    const uploadPath = join(__dirname, '../../uploads')
    await mkdir(uploadPath, { recursive: true })
    const audioPath = join(
      uploadPath,
      `${Date.now()}.${req.file.originalname.split('.').pop()}`
    )
    await writeFile(audioPath, req.file.buffer)
    const audioTranscription = await transcribeAudioVerbose(audioPath)
    const imagesPromise = []
    const squareImagesPromise = []
    const imagePrompt = await generateImagePromptFromTranscription({
      text: audioTranscription.text
    })
    console.log({
      imagePrompt
    })
    for (let i = 0; i < 19; i++) {
      imagesPromise.push(
        imageFromTranscription({
          prompt: imagePrompt,
          size: '1024x1024',
          quality: 'standard'
        })
      )
      if (i < 3) {
        squareImagesPromise.push(
          imageFromTranscription({
            prompt: imagePrompt,
            size: '1024x1024',
            quality: 'standard'
          })
        )
      }
    }
    const [hookEndWord, silences, ...rest] = await Promise.all([
      detectHookEnd({ text: audioTranscription.text }),
      detectSilences(audioPath) as unknown as Silence[],
      ...imagesPromise
    ])
    const squareImages = await Promise.all(squareImagesPromise)
    let timeHookEnd = audioTranscription.words.find(
      (word) => word.word === hookEndWord
    )

    if (await fileExists(audioPath)) {
      console.log('Deleting audio file...')
      await unlink(audioPath)
    }
    if (await fileExists(audioPath.replace('.mp3', '-temp.mp3'))) {
      console.log('Deleting temp audio file...')
      await unlink(audioPath.replace('.mp3', '-temp.mp3'))
    }
    res.json({
      audioTranscription: audioTranscription.text,
      hookEndWord,
      timeHookEnd,
      silences,
      images: rest,
      squareImages
    })
  } catch (error) {
    console.error('Error processing file:', error)
    res.status(500).send('Error processing file')
  }
})

function detectSilences(audioPath: string) {
  let dbFilter = '40'
  let unidadTiempo = '0.35'
  return new Promise((resolve, reject) => {
    const silences: Silence[] = []
    const tempOutput = `${audioPath.replace('.mp3', '-temp.mp3')}`

    console.log('Starting silence detection...') // Log de progreso

    Ffmpeg(audioPath)
      .audioFilters(`silencedetect=n=-${dbFilter}dB:d=${unidadTiempo}`)
      .output(tempOutput)
      .on('stderr', (stderrLine) => {
        const matchStart = /silence_start: (\d+\.?\d*)/.exec(stderrLine)
        if (matchStart) {
          silences.push({ start: parseFloat(matchStart[1]), end: null })
        }

        const matchEnd = /silence_end: (\d+\.?\d*)/.exec(stderrLine)
        if (matchEnd) {
          const end = parseFloat(matchEnd[1])
          if (
            silences.length > 0 &&
            silences[silences.length - 1].end === null
          ) {
            silences[silences.length - 1].end = end
          }
        }
      })
      .on('end', async () => {
        console.log('Silence detection completed.')
        resolve(silences)
      })
      .on('error', (err) => {
        reject(err)
      })
      .run()
  })
}
