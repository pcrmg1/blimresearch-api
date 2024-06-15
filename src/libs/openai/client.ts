import OpenAI from 'openai'

const openAIApiKey = process.env.OPENAI_API_KEY
export const openAI = new OpenAI({ apiKey: openAIApiKey })
