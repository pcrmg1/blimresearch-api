import { createReadStream } from 'fs'
import { openAI } from './client'

export const transcribeAudio = async (path: string) => {
  console.log('Se comenzara a transcribir el audio, ', path)
  const transcription = await openAI.audio.transcriptions.create({
    file: createReadStream(`${path}`),
    model: 'whisper-1',
    prompt:
      "Transcribe the following audio file, when a new line is spoken, write '/n' to indicate a new line."
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
