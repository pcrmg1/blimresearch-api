import { openAI } from './client'

export const friendlifyText = async ({ text }: { text: string }) => {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You will be provided with a text, you have to make it more friendly and digestible, make it more interesting and engaging. It has to be able to be read and understood by a 12 year old as well as a 60 year old. The text is thought to be part of a script for a social media video, so make it engaging and interesting. If the text is in any other language than spanish, also translate it to spanish and give me that text as the response. Solo dame el texto traducido al español como respuesta.`
      },
      {
        role: 'user',
        content: text
      }
    ]
  })
  return response.choices[0].message.content
}
