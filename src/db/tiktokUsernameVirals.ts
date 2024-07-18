import { prisma } from './prisma'

export const getTiktokViralsByUserId = async ({
  userId,
  limit,
  page
}: {
  userId: string
  limit: number
  page: number
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
    skip: page * limit
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
  usernames
}: {
  userId: string
  usernames: string[]
}) => {
  const tiktokUsernameViral = await prisma.tiktokUsernameVirals.create({
    data: {
      userId,
      usernames
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
  usernames
}: {
  id: string
  usernames: string[]
}) => {
  return await prisma.tiktokUsernameVirals.update({
    where: {
      id
    },
    data: {
      usernames
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
