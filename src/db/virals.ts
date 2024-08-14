import { prisma } from './prisma'

export const getViralVideos = async ({
  page,
  limit,
  userId,
  orderBy,
  query,
  platform
}: {
  page: number
  limit: number
  userId: string
  orderBy: string
  query: string
  platform: string
}) => {
  return await prisma.videoQuery.findMany({
    where: {
      userId,
      query: {
        contains: query,
        mode: 'insensitive'
      },
      platform
    },
    include: {
      videos: true
    },
    take: limit,
    skip: page * limit,
    orderBy: {
      [orderBy]: 'desc'
    }
  })
}

export const getViralVideosCount = async ({
  userId,
  query
}: {
  userId: string
  query?: string
}) => {
  return await prisma.videoQuery.count({
    where: {
      userId,
      query: {
        contains: query,
        mode: 'insensitive'
      }
    }
  })
}

export const getViralsByUserId = async ({ userId }: { userId: string }) => {
  return await prisma.videoQuery.findMany({
    where: {
      userId
    },
    include: { videos: true }
  })
}

export const getCarruselesByUserId = async ({ userId }: { userId: string }) => {
  return await prisma.carruselQuery.findMany({
    where: {
      userId
    },
    include: { carruseles: true }
  })
}

export const getCarruseles = async ({
  page,
  limit,
  userId,
  orderBy,
  query
}: {
  page: number
  limit: number
  userId: string
  orderBy: string
  query: string
}) => {
  return await prisma.carruselQuery.findMany({
    where: {
      userId,
      query: {
        contains: query,
        mode: 'insensitive'
      }
    },
    include: {
      carruseles: true
    },
    take: limit,
    skip: page * limit,
    orderBy: {
      [orderBy]: 'desc'
    }
  })
}

export const getCarruselesCount = async ({
  userId,
  query
}: {
  userId: string
  query?: string
}) => {
  return await prisma.carruselQuery.count({
    where: {
      userId,
      query: {
        contains: query,
        mode: 'insensitive'
      }
    }
  })
}

export const getViralsByQuery = async ({
  query,
  userId,
  platform
}: {
  query: string
  userId: string
  platform: 'instagram' | 'tiktok'
}) => {
  return await prisma.videoQuery.findMany({
    where: {
      query,
      userId,
      platform
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
  viralVideos,
  platform
}: {
  query: string
  language: string
  userId: string
  viralVideos: any[]
  platform: string
}) => {
  return await prisma.videoQuery.create({
    data: {
      query,
      language,
      userId,
      videos: {
        create: viralVideos
      },
      platform
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
  language: string
  userId: string
  carruseles: any[]
}) => {
  return await prisma.carruselQuery.create({
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
  return await prisma.videoQuery.deleteMany({
    where: {
      id
    }
  })
}

export const deleteViralCarruselQueryById = async ({ id }: { id: string }) => {
  return await prisma.carruselQuery.deleteMany({
    where: {
      id
    }
  })
}
