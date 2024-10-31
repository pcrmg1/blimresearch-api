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
    const imagePrompt = await generateImagePromptFromTranscription({
      text: audioTranscription.text
    })
    for (let i = 0; i < 3; i++) {
      imagesPromise.push(
        imageFromTranscription({
          prompt: imagePrompt,
          size: '1024x1792',
          quality: 'standard'
        })
      )
    }
    const [hookEndWord, silences, ...rest] = await Promise.all([
      detectHookEnd({ text: audioTranscription.text }),
      detectSilences(audioPath) as unknown as Silence[],
      ...imagesPromise
    ])
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
      images: rest
    })
  } catch (error) {
    console.error('Error processing file:', error)
    res.status(500).send('Error processing file')
  }
})

const data = {
  audioTranscription:
    "Fai questo se vuoi trasformare la tua macchina in una macchina di lusso. Per farlo puoi utilizzare la pellicola colorata. Prima prova a smontare tutti i pezzi che ti danno ingombro alla superficie da applicare. Secondo, pulisci perfettamente fino in fondo. Ricordati soprattutto di lavorare gli angoli. Dopo prendi le misure e inizia l'applicazione. Ricordati di spatolare bene per far uscire tutte le bolle d'aria. Vuoi che la tua macchina diventi una macchina con stile? Seguimi!",
  hookEndWord: 'lusso',
  timeHookEnd: {
    word: 'lusso',
    start: 3.799999952316284,
    end: 3.9600000381469727
  },
  silences: [
    {
      start: 5.953719,
      end: 6.314671
    },
    {
      start: 12.482925,
      end: 12.879297
    },
    {
      start: 15.268277,
      end: 15.632041
    },
    {
      start: 22.241247,
      end: 22.728005
    },
    {
      start: 24.926621,
      end: 25.327687
    },
    {
      start: 26.459819,
      end: 27.393764
    },
    {
      start: 33.807732,
      end: 34.252426
    },
    {
      start: 35.023447,
      end: 35.557438
    },
    {
      start: 38.033741,
      end: 38.891973
    }
  ],
  images: [
    'https://oaidalleapiprodscus.blob.core.windows.net/private/org-TRRqudnjJFm1ExLLEk030e3N/user-r6EswVdOahYp7HDM5dPfkMlR/img-4KWrvKM6uxjVTOR4jfD7b0HG.png?st=2024-10-31T00%3A18%3A13Z&se=2024-10-31T02%3A18%3A13Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-31T01%3A09%3A06Z&ske=2024-11-01T01%3A09%3A06Z&sks=b&skv=2024-08-04&sig=c4bwVlGcJFXGLZLWaqZ%2BM62ym1xU8fpqVcezJ/0%2ByGY%3D',
    'https://oaidalleapiprodscus.blob.core.windows.net/private/org-TRRqudnjJFm1ExLLEk030e3N/user-r6EswVdOahYp7HDM5dPfkMlR/img-Mxmblwe4R4HVT9s5wsFpj1Mo.png?st=2024-10-31T00%3A18%3A12Z&se=2024-10-31T02%3A18%3A12Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-31T01%3A11%3A43Z&ske=2024-11-01T01%3A11%3A43Z&sks=b&skv=2024-08-04&sig=MVE0a1OvzsF96aRGUYoz1xFxWd5eKCYjspivdl0a7MU%3D',
    'https://oaidalleapiprodscus.blob.core.windows.net/private/org-TRRqudnjJFm1ExLLEk030e3N/user-r6EswVdOahYp7HDM5dPfkMlR/img-OnUbFk650vxI7k13Oa5kZROU.png?st=2024-10-31T00%3A18%3A22Z&se=2024-10-31T02%3A18%3A22Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-31T01%3A18%3A22Z&ske=2024-11-01T01%3A18%3A22Z&sks=b&skv=2024-08-04&sig=H/uLLCmg7cZELXRk2/9L5PSW1L/X%2BW4IrK5NjSsjPbQ%3D'
  ]
}

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
