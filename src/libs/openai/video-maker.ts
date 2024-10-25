// Configuración de eliminación de silencios
let decibeles_filter = '40'
let unidad_tiempo_filter = '0.35'
import Ffmpeg from 'fluent-ffmpeg'

export interface Silence {
  start: number
  end: number | null
}

const path = require('path')
const fs = require('fs')
const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function deleteSilencesAndGetAudio(videoPath: string) {
  const silences = await detectSilences(videoPath)
  console.log('Silences detected:', silences)
  const newFile = await removeSilences(videoPath, silences)
  const audioFile = await extractAudio(newFile)
  return { audioFile, newFile }
}

function detectSilences(videoPath: string): Promise<Silence[]> {
  return new Promise((resolve, reject) => {
    const silences: Silence[] = []
    const tempOutput = path.join(__dirname, 'output_temp.mp4')

    console.log('Starting silence detection...') // Log de progreso

    Ffmpeg(videoPath)
      .audioFilters(
        `silencedetect=n=-${decibeles_filter}dB:d=${unidad_tiempo_filter}`
      )
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
        fs.unlinkSync(tempOutput)
        console.log('Silence detection completed.') // Log de progreso
        resolve(silences)
      })
      .on('error', (err: Error) => {
        reject(err)
      })
      .run()
  })
}

function removeSilences(
  videoPath: string,
  silences: Silence[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    let complexFilter = []
    let lastEnd = 0
    let index = 0

    console.log('Starting silence removal...') // Log de progreso

    silences.forEach((silence) => {
      if (lastEnd < silence.start) {
        complexFilter.push(
          `[0:v]trim=${lastEnd}:${silence.start},setpts=PTS-STARTPTS[v${index}]`
        )
        complexFilter.push(
          `[0:a]atrim=${lastEnd}:${silence.start},asetpts=PTS-STARTPTS[a${index}]`
        )
        index++
        console.log(
          `Adding segment from ${lastEnd} to ${silence.start} seconds`
        ) // Log de progreso
      }
      lastEnd = silence.end ?? 0
    })

    Ffmpeg.ffprobe(videoPath, (err, metadata) => {
      const videoDuration = metadata.format.duration as number
      if (lastEnd < videoDuration) {
        complexFilter.push(
          `[0:v]trim=${lastEnd}:${videoDuration},setpts=PTS-STARTPTS[v${index}]`
        )
        complexFilter.push(
          `[0:a]atrim=${lastEnd}:${videoDuration},asetpts=PTS-STARTPTS[a${index}]`
        )
        index++
        console.log(
          `Adding final segment from ${lastEnd} to ${videoDuration} seconds`
        ) // Log de progreso
      }

      let concatInputs = Array.from(
        { length: index },
        (_, i) => `[v${i}][a${i}]`
      ).join('')
      complexFilter.push(`${concatInputs}concat=n=${index}:v=1:a=1[v][a]`)

      const finalVideoPath = 'output_without_silence.mp4'

      console.log('Complex filter:', complexFilter.join(';'))
      Ffmpeg(videoPath)
        .complexFilter(complexFilter)
        .map('[v]')
        .map('[a]')
        .outputOptions('-c:v', 'h264_nvenc', '-preset', 'fast', '-b:v', '5M') // Ajusta la tasa de bits según sea necesario
        .save(finalVideoPath)
        .on('end', () => {
          console.log('Silences removed. Video saved to', finalVideoPath) // Log de progreso
          resolve(finalVideoPath)
        })
        .on('error', (error) => {
          reject(error)
        })
    })
  })
}

function extractAudio(videoPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const audioOutputPath = 'output_audio.mp3'
    console.log('Extracting audio from the processed video...') // Log de progreso

    Ffmpeg(videoPath)
      .output(audioOutputPath)
      .on('end', () => {
        console.log(
          'Audio extracted successfully. Audio saved to',
          audioOutputPath
        ) // Log de progreso
        resolve(audioOutputPath)
      })
      .on('error', (err) => {
        console.error('Error extracting audio:', err) // Log de error
        reject(err)
      })
      .run()
  })
}

async function createTranscription(audioFile: string) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFile),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word', 'segment']
  })

  fs.writeFileSync(
    'transcription.json',
    JSON.stringify(transcription, null, 2),
    'utf-8'
  )
}

// Uso de la función encapsulada
;(async () => {
  try {
    // Delete silences and make new only audio file
    let { audioFile, newFile } = await deleteSilencesAndGetAudio('input.mp4')
    console.log('Processing completed:', { audioFile, newFile })

    // From audio file, get
    createTranscription(audioFile)
  } catch (error) {
    console.error('Error processing video:', error)
  }
})()
