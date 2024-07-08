import { db } from './prisma'

export const getTranslationsWithPagination = async ({
  page,
  limit,
  userId
}: {
  page: number
  limit: number
  userId: string
}) => {
  return await db.translation.findMany({
    where: { userId },
    skip: page * limit,
    take: limit,
    include: {
      transcription: true,
      FriendlifiedTexts: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const createTranslation = async ({
  text,
  language,
  userId,
  transcriptionId
}: {
  text: string
  language: string
  userId: string
  transcriptionId?: string
}) => {
  return await db.translation.create({
    data: {
      text,
      language,
      userId,
      transcriptionId
    }
  })
}

export const deleteTranslationById = async ({ id }: { id: string }) => {
  return await db.translation.delete({
    where: {
      id
    }
  })
}

export const getTranslationByTranscriptionId = async ({
  transcriptionId,
  language
}: {
  transcriptionId: string
  language: string
}) => {
  return await db.translation.findFirst({
    where: {
      transcriptionId,
      AND: {
        language
      }
    }
  })
}
