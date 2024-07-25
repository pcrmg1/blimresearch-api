import { prisma } from './prisma'

export const createVideoTranscription = async ({
  language,
  text,
  userId,
  shortcode
}: {
  language: string
  text: string
  userId: string
  shortcode: string
}) => {
  return await prisma.transcription.create({
    data: {
      language,
      text,
      type: 'video',
      userId,
      shortcode
    }
  })
}

export const getTranscriptionsCount = async ({
  userId
}: {
  userId: string
}) => {
  return await prisma.transcription.count({
    where: { userId }
  })
}

export const createImageTranscription = async ({
  language,
  text,
  userId
}: {
  language: string
  text: string
  userId: string
}) => {
  return await prisma.transcription.create({
    data: {
      language,
      text,
      type: 'image',
      userId
    }
  })
}

export const getTranscriptionsWithPagination = async ({
  page,
  limit,
  userId
}: {
  page: number
  limit: number
  userId: string
}) => {
  return await prisma.transcription.findMany({
    where: { userId },
    skip: page * limit,
    take: limit,
    include: {
      video: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getTranscriptionsByTypeWithPagination = async ({
  page,
  limit,
  userId,
  type
}: {
  page: number
  limit: number
  userId: string
  type: 'image' | 'video'
}) => {
  return await prisma.transcription.findMany({
    where: { userId, type },
    skip: page * limit,
    take: limit,
    include: {
      video: true
    }
  })
}

export const deleteTranscriptionById = async ({ id }: { id: string }) => {
  return await prisma.transcription.delete({
    where: { id }
  })
}

export const getTranscriptionByVideoId = async ({
  shortcode
}: {
  shortcode: string
}) => {
  return await prisma.transcription.findFirst({
    where: {
      shortcode
    }
  })
}
