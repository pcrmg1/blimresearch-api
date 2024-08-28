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

adminUsersRouter.get('/', async (req, res) => {
  const { page, limit, query, orderBy, order } = req.query
  console.log({ reqQuery: req.query })
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
    console.log({ parsedQuery: parsedQuery.data })
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

adminUsersRouter.get('/count', async (req, res) => {
  try {
    const count = await getUsersCount()
    const users = await getUserCreditsInfo()
    const creditosSinGastar = users.reduce((acc, user) => {
      const creditosSinGastar = user.limiteCreditos - user.creditosUsados
      return acc + creditosSinGastar
    }, 0)
    return res.json({ data: creditosSinGastar, count })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.get('/filter', async (req, res) => {
  const { creditsLeft } = req.query
  try {
    const users = await prisma.user.findMany()
    const filteredUsers = users.filter(
      (user) => user.limiteCreditos - user.creditosUsados <= Number(creditsLeft)
    )
    return res.json({ data: filteredUsers, count: filteredUsers.length })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.use('/:id/credits', adminCreditsRouter)
