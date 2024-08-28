import { prisma } from './prisma'

export const getUserById = async ({ userId }: { userId: string }) => {
  return await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
}

export const deleteUser = async ({ userId }: { userId: string }) => {
  return await prisma.user.delete({
    where: {
      id: userId
    }
  })
}

export const getUserByEmail = async ({ email }: { email: string }) => {
  return await prisma.user.findFirst({
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

export const getAllUsers = async ({
  page,
  limit,
  query,
  orderBy,
  order
}: {
  page: number
  limit: number
  query: string
  orderBy: string
  order: 'asc' | 'desc'
}) => {
  return await prisma.user.findMany({
    where: {
      OR: [
        {
          email: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    },
    skip: page * limit,
    take: limit,
    orderBy: {
      [orderBy]: order
    }
  })
}

export const getUserCreditsInfo = async () => {
  return await prisma.user.findMany({
    select: {
      creditosUsados: true,
      gastos: true,
      limiteCreditos: true
    }
  })
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

export const getUsersCount = async () => {
  return await prisma.user.count()
}
