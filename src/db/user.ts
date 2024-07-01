import prismaDB from './prisma'

export const getUserById = async ({ userId }: { userId: string }) => {
  return await prismaDB.user.findUnique({
    where: {
      id: userId
    }
  })
}

export const getUserByEmail = async ({ email }: { email: string }) => {
  return await prismaDB.user.findFirst({
    where: {
      email
    }
  })
}

export const loginUser = async ({
  email,
  passwordHash
}: {
  email: string
  passwordHash: string
}) => {
  return await prismaDB.user.findFirst({
    where: {
      email,
      AND: {
        password: passwordHash
      }
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
  return await prismaDB.user.create({
    data: {
      email,
      password: passwordHash,
      name,
      token,
      role: role || 'User'
    }
  })
}
