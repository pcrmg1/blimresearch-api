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
