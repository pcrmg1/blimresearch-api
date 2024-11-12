import { prisma } from './prisma'

export const getInstagramViralsByUserId = async ({
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
  return await prisma.instagramUsernameVirals.findMany({
    where: {
      userId
    },
    include: {
      videos: {
        include: {
          Transcription: true
        }
      },
      carruseles: {
        include: {
          transcription: true
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

export const getInstagramViralsByUserIdCount = async ({
  userId
}: {
  userId: string
}) => {
  return await prisma.instagramUsernameVirals.count({
    where: {
      userId
    }
  })
}

export const getInstagramViralUsernameById = async ({ id }: { id: string }) => {
  return await prisma.instagramUsernameVirals.findUnique({
    where: {
      id
    },
    include: {
      videos: {
        include: {
          Transcription: true
        }
      },
      carruseles: {
        include: {
          transcription: true
        }
      }
    }
  })
}

export const createInstagramUsernameViral = async ({
  userId,
  usernames,
  name
}: {
  userId: string
  usernames: string[]
  name: string
}) => {
  const tiktokUsernameViral = await prisma.instagramUsernameVirals.create({
    data: {
      userId,
      usernames,
      name
    }
  })
  return tiktokUsernameViral
}

export const deleteInstagramUsernameViralList = async ({
  id
}: {
  id: string
}) => {
  return await prisma.instagramUsernameVirals.delete({
    where: {
      id
    }
  })
}

export const updateInstagramUsernameViral = async ({
  id,
  usernames,
  name
}: {
  id: string
  usernames: string[]
  name: string
}) => {
  return await prisma.instagramUsernameVirals.update({
    where: {
      id
    },
    data: {
      usernames,
      name
    }
  })
}

export const deleteInstagramViralVideoByListId = async ({
  listId
}: {
  listId: string
}) => {
  return await prisma.video.deleteMany({
    where: {
      instagramUsernameViralsId: listId
    }
  })
}

export const getInstagramViralVideosByListName = async ({
  name
}: {
  name: string
}) => {
  return await prisma.instagramUsernameVirals.findMany({
    where: {
      name
    }
  })
}
