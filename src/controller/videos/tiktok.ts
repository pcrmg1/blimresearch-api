import { addSpentUSD } from '../../db/user'
import { createQueryVirals } from '../../db/virals'
import {
  getTiktokViralProfiles,
  getTiktokViralVideos
} from '../../libs/apify/tiktok'
import { translateQuery } from '../../libs/openai/translations'
import { formatCurrencyToAddToDB } from '../../utils/currency'

export const getTiktokVirals = async ({
  query,
  language,
  minNumberOfFans,
  userId,
  maxDurationVideo,
  minDurationVideo
}: {
  query: string
  language: string
  minNumberOfFans: number
  userId: string
  maxDurationVideo?: number
  minDurationVideo?: number
}) => {
  const translatedQuery = await translateQuery({
    text: query,
    toLanguage: language
  })
  const { items: virals, cost } = await getTiktokViralVideos({
    query: translatedQuery as string,
    minFans: minNumberOfFans
  })
  const viralProfiles = virals.map((profile) => profile.name)
  const { items: profiles, cost: costFromProfiles } =
    await getTiktokViralProfiles({
      profiles: viralProfiles,
      maxDurationVideo,
      minDurationVideo
    })
  const totalCost = formatCurrencyToAddToDB(cost + costFromProfiles)
  await addSpentUSD({ userId, spentUSD: totalCost })

  const languageAdded = profiles
    .filter((profile: any) => profile.videoUrl)
    .map((profile: any) => ({
      ...profile,
      language,
      platform: 'tiktok',
      userId
    }))
  const queryCreated = await createQueryVirals({
    query: query as string,
    language,
    userId,
    viralVideos: languageAdded,
    platform: 'tiktok'
  })
  return queryCreated
}
