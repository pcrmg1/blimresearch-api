import { prisma } from './prisma'

export const getTiktokViralsByUserId = async ({
  userId,
  limit,
  page,
  orderBy
}: {
  userId: string
  limit: number
  page: number
  orderBy: string
}) => {
  return await prisma.tiktokUsernameVirals.findMany({
    where: {
      userId
    },
    include: {
      videos: {
        include: {
          Transcription: true
        }
      }
    },
    take: limit,
    skip: page * limit,
    orderBy: {
      [orderBy]: 'desc'
    }
  })
}

export const getTiktokViralsByUserIdCount = async ({
  userId
}: {
  userId: string
}) => {
  return await prisma.tiktokUsernameVirals.count({
    where: {
      userId
    }
  })
}

export const getTiktokViralUsernameById = async ({ id }: { id: string }) => {
  return await prisma.tiktokUsernameVirals.findUnique({
    where: {
      id
    },
    include: {
      videos: {
        include: {
          Transcription: true
        }
      }
    }
  })
}

export const createTiktokUsernameViral = async ({
  userId,
  usernames,
  name
}: {
  userId: string
  usernames: string[]
  name: string
}) => {
  const tiktokUsernameViral = await prisma.tiktokUsernameVirals.create({
    data: {
      userId,
      usernames,
      name
    }
  })
  return tiktokUsernameViral
}

export const deleteTiktokUsernameViralList = async ({ id }: { id: string }) => {
  return await prisma.tiktokUsernameVirals.delete({
    where: {
      id
    }
  })
}

export const updateTiktokUsernameViral = async ({
  id,
  usernames,
  name
}: {
  id: string
  usernames: string[]
  name: string
}) => {
  return await prisma.tiktokUsernameVirals.update({
    where: {
      id
    },
    data: {
      usernames,
      name
    }
  })
}

export const deleteTiktokViralVideoByListId = async ({
  listId
}: {
  listId: string
}) => {
  return await prisma.video.deleteMany({
    where: {
      tiktokUsernameViralsId: listId
    }
  })
}

export const getTiktokViralVideosByListName = async ({
  name
}: {
  name: string
}) => {
  return await prisma.tiktokUsernameVirals.findMany({
    where: {
      name
    }
  })
}
