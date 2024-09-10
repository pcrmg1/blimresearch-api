import { createReadStream } from 'fs'
import { openAI } from './client'

export const transcribeAudio = async (path: string) => {
  const transcription = await openAI.audio.transcriptions.create({
    file: createReadStream(`${path}`),
    model: 'whisper-1',
    prompt:
      "Transcribe el siguiente audio a español, si no hay texto, solo escribe 'null' como respuesta. Recuerda que no quiero que me agregues nada, solo traduce el texto proporcionado"
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
            text: `I want you to read this image and provide me the text thats written in it, if there is no text, just give me 'null' as an answer. Only provide me with the text in the image, nothing else. The image is the following:`
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
