import { prisma } from '../prisma'

export const getGuiones = async ({ userId }: { userId: string }) => {
  return await prisma.guion.findMany({ where: { userId } })
}

export const getGuionesWithPagination = async ({
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
  return await prisma.guion.findMany({
    where: { userId },
    skip: page * limit,
    take: limit,
    orderBy: {
      [orderBy]: order
    }
  })
}

export const getGuionesCount = async ({ userId }: { userId: string }) => {
  return await prisma.guion.count({ where: { userId } })
}

export const getGuionById = async ({
  id,
  userId
}: {
  id: string
  userId: string
}) => {
  return await prisma.guion.findUnique({ where: { id, userId } })
}

export const createGuion = async ({
  userId,
  nombre,
  text,
  hook,
  contenido,
  cta,
  tipoCta,
  estado,
  fecha_uso,
  listaGuionId
}: {
  userId: string
  nombre?: string
  text: string
  hook?: string
  contenido?: string
  cta?: string
  tipoCta?: string
  estado?: string
  fecha_uso?: Date
  listaGuionId?: string
}) => {
  return await prisma.guion.create({
    data: {
      userId,
      nombre,
      text,
      hook,
      contenido,
      cta,
      tipoCta,
      estado,
      fecha_uso,
      listaGuionId
    }
  })
}

export const updateGuion = async ({
  id,
  userId,
  nombre,
  text,
  hook,
  contenido,
  cta,
  tipoCta,
  estado,
  fecha_uso,
  listaGuionId
}: {
  id: string
  userId: string
  nombre?: string
  text?: string
  hook?: string
  contenido?: string
  cta?: string
  tipoCta?: string
  estado?: string
  fecha_uso?: Date
  listaGuionId?: string
}) => {
  return await prisma.guion.update({
    where: { id, userId },
    data: {
      nombre,
      text,
      hook,
      contenido,
      cta,
      tipoCta,
      estado,
      fecha_uso,
      listaGuionId
    }
  })
}
