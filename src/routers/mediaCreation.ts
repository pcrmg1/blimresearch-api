import { Router } from 'express'

export const mediaCreationRouter = Router()

mediaCreationRouter.post('/upload', (req, res) => {
  res.json({
    message: 'Upload successful'
  })
})
