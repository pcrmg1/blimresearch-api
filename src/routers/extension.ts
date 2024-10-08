import { Router } from 'express'
import { generateTopicsQueries } from '../libs/openai/topics'

export const extensionRouter = Router()

extensionRouter.post('/topics', async (req, res) => {
  const { beneficios, problemas, ejemplos } = req.body
  try {
    const queryTopics = await generateTopicsQueries({
      beneficios,
      problemas,
      ejemplos
    })
    if (!queryTopics) {
      return res.status(400).json({ message: 'No topics found' })
    }
    const topicUrls = queryTopics.topics.slice(0, 20).map((query) => {
      const tiktokUrl = new URL('https://www.tiktok.com/search')
      tiktokUrl.searchParams.append('q', query)
      return { url: tiktokUrl.toString(), query }
    })
    return res.json({
      data: {
        topicUrls
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})
