import { Router } from 'express'
import { appendToFile } from '../utils/writeTxt'

export const buysRouter = Router()

buysRouter.post('/coralmujaesweb', async (req, res) => {
  const { body } = req
  try {
    console.log('Escribiendo en archivo...')
    await appendToFile('src/coralmujaes.txt', {
      timestamp: new Date().toISOString(),
      ...body
    })
    return res
      .status(200)
      .json({ message: 'Data written successfully', data: body })
  } catch (error) {
    console.error('Error writing to file:', error)
    return res.status(500).json({ message: 'Error writing to file' })
  }
})
