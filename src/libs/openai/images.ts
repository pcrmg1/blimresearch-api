import { openAI } from './client'

export const imageFromTranscription = async ({
  prompt,
  size,
  quality
}: {
  prompt: string
  size:
    | '1024x1024'
    | '256x256'
    | '512x512'
    | '1792x1024'
    | '1024x1792'
    | null
    | undefined
  quality: 'standard' | 'hd'
}) => {
  const image = await openAI.images.generate({
    prompt: prompt,
    n: 1,
    model: 'dall-e-3',
    size: size,
    quality
  })
  return image.data[0].url
}

export const generateImagePromptFromTranscription = async ({
  text
}: {
  text: string
}) => {
  const imagePrompt = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `I'll give you a text which is a transcription from a video and i want you to create an image prompt to be passed to dall-e to generate an image from it. The transcription has to be made thinking it will be uploaded to instagram, so the image has to get people's attention. The transcription is the following:`
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text
          }
        ]
      }
    ]
  })
  if (!imagePrompt.choices[0].message.content) {
    throw new Error(`No image prompt coul'd be generated`)
  }
  return imagePrompt.choices[0].message.content
}
