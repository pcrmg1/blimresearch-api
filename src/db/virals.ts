import prismaDB from './prisma'

export const getVirals = async ({
  page,
  limit,
  userId
}: {
  page: number
  limit: number
  userId: string
}) => {
  return await prismaDB.videoQuery.findMany({
    where: {
      userId
    },
    include: {
      videos: true
    },
    take: limit,
    skip: page * limit
  })
}

export const getViralsByQuery = async ({
  query,
  userId
}: {
  query: string
  userId: string
}) => {
  return await prismaDB.videoQuery.findMany({
    where: {
      query,
      userId
    },
    include: {
      videos: true
    }
  })
}

export const createQueryVirals = async ({
  query,
  language,
  userId,
  viralVideos
}: {
  query: string
  language: string
  userId: string
  viralVideos: any[]
}) => {
  return await prismaDB.videoQuery.create({
    data: {
      query,
      language,
      userId,
      videos: {
        create: viralVideos
      }
    },
    include: {
      videos: true
    }
  })
}

export const createCarruselQuery = async ({
  query,
  language,
  userId,
  carruseles
}: {
  query: string
  language?: string
  userId: string
  carruseles: any[]
}) => {
  return await prismaDB.carruselQuery.create({
    data: {
      query,
      language,
      userId,
      carruseles: {
        create: carruseles
      }
    },
    include: {
      carruseles: true
    }
  })
}

export const deleteViralQueryById = async ({ id }: { id: string }) => {
  return await prismaDB.videoQuery.deleteMany({
    where: {
      id
    }
  })
}
