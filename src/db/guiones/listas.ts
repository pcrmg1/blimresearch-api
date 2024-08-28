import { prisma } from '../prisma'

export const getListaGuiones = async ({ userId }: { userId: string }) => {
  return await prisma.lista_Guiones.findMany({ where: { userId } })
}

export const getListaGuionesWithPagination = async ({
  userId,
  skip,
  take
}: {
  userId: string
  skip: number
  take: number
}) => {
  return await prisma.lista_Guiones.findMany({
    where: { userId },
    skip,
    take,
    include: {
      guiones: true
    }
  })
}

export const getListaGuionesCount = async ({ userId }: { userId: string }) => {
  return await prisma.lista_Guiones.count({ where: { userId } })
}

export const getListaGuionById = async ({ id }: { id: string }) => {
  return await prisma.lista_Guiones.findUnique({
    where: { id },
    include: {
      guiones: true
    }
  })
}
