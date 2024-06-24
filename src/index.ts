import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { authRouter } from './routers/auth'
import { usersRouter } from './routers/admin/users'
import { transcriptionsRouter } from './routers/trancriptions'
import { translationsRouter } from './routers/translations'
import { friendlifyRouter } from './routers/friendlify'

import { isAdmin } from './middlewares/isAdmin'
import { verifyToken } from './middlewares/verifyToken'
import { viralsRouter } from './routers/virals'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) =>
  res.json({
    message: 'Hello from BlimResearch API 🚀'
  })
)
app.use('/api/auth', authRouter)
app.use('/api/admin/users', verifyToken, isAdmin, usersRouter)
app.use('/api/transcriptions', verifyToken, transcriptionsRouter)
app.use('/api/translations', verifyToken, translationsRouter)
app.use('/api/friendlify', verifyToken, friendlifyRouter)
app.use('/api/virals', verifyToken, viralsRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`⚡️: Server running at port: ${PORT}`))
