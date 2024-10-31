import { createReadStream } from 'fs'
import { openAI } from './client'

export const transcribeAudio = async (path: string) => {
  const file = createReadStream(`${path}`)
  const transcription = await openAI.audio.transcriptions.create({
    file,
    model: 'whisper-1'
  })
  return transcription.text
}

export const transcribeImage = async ({ imgUrl }: { imgUrl: string }) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `I want you to read this image and provide me the text thats written in it. Only provide me with the text in the image, nothing else. if there is no text, just give me 'null' as an answer.  The image is the following:`
          },
          {
            type: 'image_url',
            image_url: {
              url: imgUrl
            }
          }
        ]
      }
    ]
  })
  return response.choices[0].message.content
}

export const transcribeAudioVerbose = async (path: string) => {
  const file = createReadStream(`${path}`)
  const transcription = await openAI.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word']
  })
  console.log({ transcription })
  return transcription as {
    text: string
    words: { word: string; start: number; end: number }[]
  }
}

export const detectHookEnd = async ({ text }: { text: string }) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `I'll give you an audio transcription and I want you to tell me the word in which the hook of the video ends, I just need the word, nothing else, don't add anything to it. The transcription is the following:`
          },
          {
            type: 'text',
            text
          }
        ]
      }
    ]
  })
  return response.choices[0].message.content
}
