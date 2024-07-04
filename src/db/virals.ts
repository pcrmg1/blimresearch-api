import { prismaDB } from '../index'

export const getVirals = async ({
  page,
  limit,
  userId
}: {
  page: number
  limit: number
  userId: string
}) => {
  let result: any[] = []
  let fetchedItemsCount = 0
  let skip = page * limit

  while (result.length < limit) {
    const items = await prismaDB.videoQuery.findMany({
      where: {
        userId
      },
      include: {
        videos: true
      },
      take: limit,
      skip: skip + fetchedItemsCount
    })

    fetchedItemsCount += items.length

    // Filter out the items where `videos` is an empty array
    const filteredItems = items.filter((item) => item.videos.length > 0)
    result = result.concat(filteredItems)

    // Break the loop if there are no more items to fetch
    if (items.length < limit) {
      break
    }
  }

  return result.slice(0, limit)
}

export const getCarruseles = async ({
  page,
  limit,
  userId
}: {
  page: number
  limit: number
  userId: string
}) => {
  let result: any[] = []
  let fetchedItemsCount = 0
  let skip = page * limit

  while (result.length < limit) {
    const items = await prismaDB.carruselQuery.findMany({
      where: {
        userId
      },
      include: {
        carruseles: true
      },
      take: limit,
      skip: skip + fetchedItemsCount
    })

    fetchedItemsCount += items.length

    // Filter out the items where `carruseles` is an empty array
    const filteredItems = items.filter((item) => item.carruseles.length > 0)
    result = result.concat(filteredItems)

    // Break the loop if there are no more items to fetch
    if (items.length < limit) {
      break
    }
  }

  return result.slice(0, limit)
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
  return await prismaDB.videoQuery.findMany({
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
  return await prismaDB.videoQuery.create({
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
