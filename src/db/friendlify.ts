import { prisma } from './prisma'

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
  return await prisma.friendlifiedText.create({
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
  userId,
  orderBy
}: {
  page: number
  limit: number
  userId: string
  orderBy: string
}) => {
  return await prisma.friendlifiedText.findMany({
    where: { userId },
    skip: page * limit,
    take: limit,
    include: {
      transcription: true,
      translation: true
    },
    orderBy: {
      [orderBy]: 'desc'
    }
  })
}

export const getFriendlifiedTextCount = async ({
  userId
}: {
  userId: string
}) => {
  return await prisma.friendlifiedText.count({
    where: { userId }
  })
}

export const deleteFriendlifiedTextById = async ({ id }: { id: string }) => {
  return await prisma.friendlifiedText.delete({
    where: {
      id
    }
  })
}
