import { prisma } from '../prisma'

export const getGuiones = async ({ userId }: { userId: string }) => {
  return await prisma.guion.findMany({ where: { userId } })
}

export const getGuionesWithPagination = async ({
  userId,
  skip,
  take
}: {
  userId: string
  skip: number
  take: number
}) => {
  return await prisma.guion.findMany({
    where: { userId },
    skip,
    take
  })
}

export const getGuionesCount = async ({ userId }: { userId: string }) => {
  return await prisma.guion.count({ where: { userId } })
}

export const getGuionById = async ({ id }: { id: string }) => {
  return await prisma.guion.findUnique({ where: { id } })
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
  fecha_uso?: string
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
