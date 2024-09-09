import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserCreditsInfo,
  getUsersCount
} from '../../db/user'
import { QueryParamsSchema } from '../../models/queryParams'
import { NewUserSchema } from '../../models/user'
import { hashPassword } from '../../utils/password'
import { adminCreditsRouter } from './credits'
import { generateNewUserEmail } from '../../libs/nodemailer/templates/newUser'
import { sendMail } from '../../libs/nodemailer/transporter'
import { prisma } from '../../db/prisma'
import { z } from 'zod'

export const adminUsersRouter = Router()

adminUsersRouter.post('/', async (req, res) => {
  try {
    const { email, password, role, name } = req.body
    const parsedCredentials = await NewUserSchema.safeParseAsync({
      email,
      password,
      role,
      name
    })
    if (!parsedCredentials.success) {
      return res.status(400).json({
        message: 'Credenciales no validas para crear el usuario'
      })
    }
    const userFound = await getUserByEmail({ email })
    if (userFound) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }
    const hashedPassword = await hashPassword({ password })
    const user = createUser({
      email,
      passwordHash: hashedPassword,
      role,
      name
    })
    const html = generateNewUserEmail({ username: email, password })
    await sendMail({
      emailTo: email,
      subject: 'Bienvenido a SocialBoost! 🚀',
      html
    })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.post('/bulk', async (req, res) => {
  try {
    const { users } = req.body

    const usersPromises = users.map(async (email: string) => {
      try {
        const parsedUser = await z.string().email().safeParseAsync(email)
        if (!parsedUser.success) {
          throw new Error('Email no válido: ' + email)
        }
        const userFound = await getUserByEmail({ email })
        if (userFound) {
          throw new Error('El usuario ya existe: ' + email)
        }

        const randomPassword = Math.random().toString(36).slice(-12)
        const hashedPassword = await hashPassword({ password: randomPassword })

        const newUser = await createUser({
          email,
          passwordHash: hashedPassword,
          role: 'User',
          name: email
        })

        const html = generateNewUserEmail({
          username: email,
          password: randomPassword
        })

        await sendMail({
          emailTo: email,
          subject: 'Bienvenido a SocialBoost! 🚀',
          html
        })

        return { success: true, data: newUser }
      } catch (error) {
        if (error instanceof Error) {
          return { success: false, error: error.message }
        } else {
          return { success: false, error: 'Hubo un error al crear el usuario' }
        }
      }
    })

    const usersCreated = await Promise.allSettled(usersPromises)

    const successfulUsers = usersCreated
      .filter(
        (result) =>
          result.status === 'fulfilled' && result.value && result.value.success
      )
      .map((result) => {
        return result.status === 'fulfilled' && result.value.data
      })

    const failedUsers = usersCreated
      .filter((result) => result.status === 'rejected' || !result.value.success)
      .map((result) => {
        if (result.status === 'rejected' && result.reason instanceof Error) {
          return { error: result.reason.message }
        } else if (result.status === 'fulfilled') {
          return { error: result.value.error }
        } else {
          return { error: 'Error desconocido' }
        }
      })

    return res.json({
      success: successfulUsers,
      usuariosCreados: successfulUsers.length,
      failed: failedUsers,
      usuariosFallidos: failedUsers.length
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.get('/', async (req, res) => {
  const { page, limit, query, orderBy, order } = req.query
  try {
    const parsedQuery = await QueryParamsSchema.safeParseAsync({
      page: isNaN(Number(page)) ? 0 : Number(page),
      limit: isNaN(Number(limit)) ? 20 : Number(limit),
      query,
      orderBy,
      order
    })
    if (!parsedQuery.success) {
      return res.status(400).json({ message: 'Query params are not valid' })
    }
    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString,
      order: parsedOrder
    } = parsedQuery.data
    const users = await getAllUsers({
      limit: parsedLimit,
      page: parsedPage,
      query: parsedQueryString,
      orderBy: parsedOrderBy,
      order: parsedOrder
    })
    const usersCredits = await getUserCreditsInfo()
    const creditosSinGastar = usersCredits.reduce((acc, user) => {
      const creditosSinGastar = user.limiteCreditos - user.creditosUsados
      return acc + creditosSinGastar
    }, 0)
    const count = await getUsersCount()
    const nextPage = count > parsedPage * parsedLimit + users.length
    const prevPage = parsedPage > 0
    return res.json({
      data: { users, creditosSinGastar },
      nextPage,
      prevPage,
      count
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await getUserById({ userId: id })
    return res.json({ data: user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await deleteUser({ userId: id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.json({ message: 'User deleted' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.post('/count', async (req, res) => {
  try {
    const count = await getUsersCount()
    const users = await getUserCreditsInfo()
    const creditosSinGastar = users.reduce((acc, user) => {
      const creditosSinGastar = user.limiteCreditos - user.creditosUsados
      return acc + creditosSinGastar
    }, 0)
    return res.json({ data: { creditosSinGastar, usersCount: count } })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.post('/filter', async (req, res) => {
  const { creditsLeft } = req.body
  try {
    const users = await prisma.user.findMany()
    const filteredUsers = users.filter((user) => {
      const creditsLeftPerUser = user.limiteCreditos - user.creditosUsados
      return creditsLeftPerUser >= Number(creditsLeft)
    })
    return res.json({ data: filteredUsers, count: filteredUsers.length })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.use('/:id/credits', adminCreditsRouter)
