import { Router } from 'express'
import { join } from 'path'
import { mkdir } from 'fs/promises'
import {
  detectHookEnd,
  transcribeAudioVerbose
} from '../libs/openai/trancriptions'
import Ffmpeg from 'fluent-ffmpeg'
import { Silence } from '../libs/openai/video-maker'

export const pythonRouter = Router()

pythonRouter.get('/', async (req, res) => {
  const audioPath = join(__dirname, '..', '..', '/uploads', 'audio.mp3')
  const audioFolder = join(__dirname, '..', '..', '/uploads')
  const audioTranscription = await transcribeAudioVerbose(audioPath)
  const hookEndWord = await detectHookEnd({ text: audioTranscription.text })
  let timeHookEnd = audioTranscription.words.find(
    (word) => word.word === hookEndWord
  )
  let timeHookEndsInSilence
  const silences = (await detectSilences(
    audioPath,
    audioFolder
  )) as unknown as Silence[]
  for (const silence of silences) {
    if (!timeHookEnd) {
      throw new Error('Hook end word not found')
    }
    if (silence.end && silence.end > timeHookEnd.end) {
      timeHookEndsInSilence = {
        word: timeHookEnd.word,
        start: silence.start,
        end: silence.end
      }
      break
    }
  }
  res.json({
    audioTranscription: audioTranscription.text,
    hookEndWord,
    timeHookEnd,
    timeHookEndsInSilence,
    silences
  })
})

function detectSilences(audioPath: string, audiosFolder: string) {
  let dbFilter = '40'
  let unidadTiempo = '0.35'
  return new Promise((resolve, reject) => {
    const silences: Silence[] = []
    const tempOutput = join(audiosFolder, 'output_temp.mp4')

    console.log('Starting silence detection...') // Log de progreso

    Ffmpeg(audioPath)
      .audioFilters(`silencedetect=n=-${dbFilter}dB:d=${unidadTiempo}`)
      .output(tempOutput)
      .on('stderr', (stderrLine) => {
        const matchStart = /silence_start: (\d+\.?\d*)/.exec(stderrLine)
        if (matchStart) {
          silences.push({ start: parseFloat(matchStart[1]), end: null })
          console.log(`Silence detected starting at ${matchStart[1]} seconds`) // Log de progreso
        }

        const matchEnd = /silence_end: (\d+\.?\d*)/.exec(stderrLine)
        if (matchEnd) {
          const end = parseFloat(matchEnd[1])
          if (
            silences.length > 0 &&
            silences[silences.length - 1].end === null
          ) {
            silences[silences.length - 1].end = end
            console.log(`Silence ended at ${end} seconds`) // Log de progreso
          }
        }
      })
      .on('end', () => {
        console.log('Silence detection completed.') // Log de progreso
        resolve(silences)
      })
      .on('error', (err) => {
        reject(err)
      })
      .run()
  })
}
