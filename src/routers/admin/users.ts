import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersCount
} from '../../db/user'
import { QueryParamsSchema } from '../../models/queryParams'
import { NewUserSchema } from '../../models/user'
import { hashPassword } from '../../utils/password'
import { adminCreditsRouter } from './credits'

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
    const hashedPassword = await hashPassword({ password })
    const user = createUser({
      email,
      passwordHash: hashedPassword,
      role,
      name
    })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

adminUsersRouter.get('/', async (req, res) => {
  const { page, limit, query, orderBy } = req.query
  try {
    const parsedQuery = await QueryParamsSchema.safeParseAsync({
      page: isNaN(Number(page)) ? 0 : Number(page),
      limit: isNaN(Number(limit)) ? 20 : Number(limit),
      query,
      orderBy
    })
    if (!parsedQuery.success) {
      return res.status(400).json({ message: 'Query params are not valid' })
    }

    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString
    } = parsedQuery.data
    const users = await getAllUsers({
      limit: parsedLimit,
      page: parsedPage,
      query: parsedQueryString,
      orderBy: parsedOrderBy
    })
    const count = await getUsersCount()
    const nextPage = count > parsedPage * parsedLimit + users.length
    const prevPage = parsedPage > 0
    return res.json({ data: users, nextPage, prevPage, count })
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

adminUsersRouter.use('/:id/credits', adminCreditsRouter)
