import { z } from 'zod'
import { openAI } from './client'
import { zodResponseFormat } from 'openai/helpers/zod'

export const GenerateTopicsResponseSchema = z.object({
  topics: z.array(z.string())
})

export const generateTopicsQueries = async ({
  beneficios,
  problemas,
  ejemplos
}: {
  beneficios: string
  problemas: string
  ejemplos: string
}) => {
  const response = await openAI.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: `Quiero crear contenido en TikTok que sea tan atractivo que cualquier persona, tenga o no interés en el nicho, se quede a ver el video. Dame 20 subtemas que sean simples, claros y entretenidos, que ofrezcan un beneficio, resuelvan un problema o que la audiencia se sienta identificada emocionalmente. Los subtemas deben tener un máximo de 4 palabras, estar diseñados para captar la atención masiva, y ser entendibles tanto para niños como adultos, independientemente de si están familiarizados con el nicho.`
      },
      {
        role: 'user',
        content: `
         Los beneficios que puedo dar son:
        ${beneficios}
        
        Los problemas que puedo solucionar son:
        ${problemas}
        
        Los ejemplos de temas que podrías tocar son:
        ${ejemplos}`
      }
    ],
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: zodResponseFormat(GenerateTopicsResponseSchema, 'topics')
  })
  return response.choices[0].message.parsed
}
