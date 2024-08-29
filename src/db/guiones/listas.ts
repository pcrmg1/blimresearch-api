import { prisma } from '../prisma'

export const getListaGuiones = async ({ userId }: { userId: string }) => {
  return await prisma.lista_Guiones.findMany({ where: { userId } })
}

export const getListaGuionesWithPagination = async ({
  userId,
  page,
  limit,
  orderBy,
  order
}: {
  userId: string
  page: number
  limit: number
  orderBy: string
  order: 'asc' | 'desc'
}) => {
  return await prisma.lista_Guiones.findMany({
    where: { userId },
    skip: page * limit,
    take: limit,
    include: {
      guiones: true
    },
    orderBy: {
      [orderBy]: order
    }
  })
}

export const getListaGuionesCount = async ({ userId }: { userId: string }) => {
  return await prisma.lista_Guiones.count({ where: { userId } })
}

export const getListaGuionById = async ({
  id,
  userId
}: {
  id: string
  userId: string
}) => {
  return await prisma.lista_Guiones.findUnique({
    where: { id, userId },
    include: {
      guiones: true
    }
  })
}

export const createListaGuion = async ({
  nombre,
  userId
}: {
  nombre: string
  userId: string
}) => {
  return await prisma.lista_Guiones.create({
    data: { nombre, userId }
  })
}

export const updateListaGuion = async ({
  id,
  nombre,
  userId
}: {
  id: string
  nombre: string
  userId: string
}) => {
  return await prisma.lista_Guiones.update({
    where: { id, userId },
    data: { nombre }
  })
}
