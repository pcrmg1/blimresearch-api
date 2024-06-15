import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const usersData = [
  // we only have on user here
  {
    email: 'email@domain.com',
    name: 'name',
    password: 'password'
  }
]
