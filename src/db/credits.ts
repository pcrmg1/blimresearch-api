import { prisma } from './prisma'

export const addUserCredits = async ({
  userId,
  credits,
  concepto
}: {
  userId: string
  credits: number
  concepto: string
}) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      creditosUsados: {
        increment: credits
      },
      UsoCreditos: {
        create: {
          concepto,
          creditosUsados: credits
        }
      }
    }
  })
}

export const modifyUserCredits = async ({
  userId,
  credits,
  concepto
}: {
  userId: string
  credits: number
  concepto: string
}) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      creditosUsados: credits,
      UsoCreditos: {
        create: {
          concepto,
          creditosUsados: credits
        }
      }
    }
  })
}

export const modifyCreditLimit = async ({
  userId,
  newCredits
}: {
  userId: string
  newCredits: number
}) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      limiteCreditos: newCredits
    }
  })
}

export const getUserCredits = async ({ userId }: { userId: string }) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UsoCreditos: true
    }
  })
}
