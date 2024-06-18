import prismaDB from './prisma'

export const createFriendlifiedText = async ({
  language,
  text,
  userId,
  transcriptionId,
  translationId
}: {
  language: string
  text: string
  userId: string
  transcriptionId?: string
  translationId?: string
}) => {
  return await prismaDB.friendlifiedText.create({
    data: {
      language,
      text,
      userId,
      transcriptionId,
      translationId
    }
  })
}

export const getFriendlifiedTextWithPagination = async ({
  page,
  limit,
  userId
}: {
  page: number
  limit: number
  userId: string
}) => {
  return await prismaDB.friendlifiedText.findMany({
    where: { userId },
    skip: page * limit,
    take: limit,
    include: {
      transcription: true,
      translation: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const deleteFriendlifiedTextById = async ({ id }: { id: string }) => {
  return await prismaDB.friendlifiedText.delete({
    where: {
      id
    }
  })
}
