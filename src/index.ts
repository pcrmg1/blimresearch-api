import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'

import { authRouter } from './routers/auth'
import { adminUsersRouter } from './routers/admin/users'
import { transcriptionsRouter } from './routers/trancriptions'
import { translationsRouter } from './routers/translations'
import { friendlifyRouter } from './routers/friendlify'
import { mediaCreationRouter } from './routers/mediaCreation'
import { isAdmin } from './middlewares/isAdmin'
import { verifyToken } from './middlewares/verifyToken'
import { viralsRouter } from './routers/virals'
import { resetDBRouter } from './routers/resetDb'

import { PrismaClient } from '@prisma/client'
import { tiktokUsernameViralsRouter } from './routers/tiktokUsernameVirals'
import { usersRouter } from './routers/users'
import { maintenanceRouter } from './routers/maintenance'
import { guionesRouter } from './routers/guiones'
import { listaGuionesRouter } from './routers/listaGuiones'
import { instagramUsernameViralsRouter } from './routers/instagramUsernameVirals'
import { buysRouter } from './routers/buys'
import { extensionRouter } from './routers/extension'

export const prismaDB = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn']
      : ['warn']
})

const app = express()

app.use(cors())
app.use(compression())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) =>
  res.json({
    message: 'Hello from blimAPI 🚀'
  })
)

app.use('/api/auth', authRouter)
app.use('/api/maintenance', verifyToken, maintenanceRouter)
app.use('/api/admin/users', verifyToken, isAdmin, adminUsersRouter)
app.use('/api/users', verifyToken, usersRouter)
app.use('/api/transcriptions', verifyToken, transcriptionsRouter)
app.use('/api/translations', verifyToken, translationsRouter)
app.use('/api/friendlify', verifyToken, friendlifyRouter)
app.use('/api/virals', verifyToken, viralsRouter)
app.use('/api/mediaCreation', verifyToken, mediaCreationRouter)
app.use('/api/tiktokUsernameVirals', verifyToken, tiktokUsernameViralsRouter)
app.use(
  '/api/instagramUsernameVirals',
  verifyToken,
  instagramUsernameViralsRouter
)
app.use('/api/resetDb', resetDBRouter)
app.use('/api/guiones', verifyToken, guionesRouter)
app.use('/api/listaGuiones', verifyToken, listaGuionesRouter)
app.use('/api/buys', buysRouter)
app.use('/api/extension', extensionRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`⚡️: Server running at port: ${PORT}`))
