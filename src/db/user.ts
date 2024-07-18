import { prisma } from './prisma'

export const getUserById = async ({ userId }: { userId: string }) => {
  return await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
}

export const getUserByEmail = async ({ email }: { email: string }) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const loginUser = async ({ email }: { email: string }) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const getAllUsers = async () => {
  return await prisma.user.findMany()
}

export const createUser = async ({
  email,
  passwordHash,
  name,
  role,
  token
}: {
  email: string
  passwordHash: string
  name?: string
  role?: 'User' | 'Admin'
  token?: string
}) => {
  return await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name,
      token,
      role: role || 'User'
    }
  })
}

export const addSpentUSD = async ({
  userId,
  spentUSD
}: {
  userId: string
  spentUSD: number
}) => {
  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      gastos: {
        increment: spentUSD
      }
    }
  })
}
