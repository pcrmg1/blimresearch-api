import { createReadStream } from 'fs'
import { openAI } from './client'

export const transcribeAudio = async (path: string) => {
  console.log('Se comenzara a transcribir el audio, ', path)
  const transcription = await openAI.audio.transcriptions.create({
    file: createReadStream(`./${path}`),
    model: 'whisper-1',
    prompt:
      "Transcribe the following audio file, when a new line is spoken, write '/n' to indicate a new line."
  })
  return transcription.text
}

export const transcribeImage = async ({
  imgUrl,
  hashtagsToCompare
}: {
  imgUrl: string
  hashtagsToCompare?: string
}) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `I want you to read this image and provide me the text thats written in it, if there is no text, just give me 'null' as an answer, i want the answer in a JSON format and with two items in the object, one has to be the text in the image (Remember, if there is none, give me 'null') ${
              hashtagsToCompare &&
              'and the other will be a boolean indicating if the image has something in common with the next hashtags: '
            } ${hashtagsToCompare}. Remember how the output has to be: 
              a json with these two values: {text, hasCommonHashtags} where text is the text in the image and hasCommonHashtags is a boolean indicating if the image has something in common with the next hashtags. If there is no text in the image, just give me 'null' as an answer. If there is no hashtags to compare, just ignore this part of the prompt.`
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
  console.log(response.choices[0].message.content)
  return response.choices[0].message.content
}
