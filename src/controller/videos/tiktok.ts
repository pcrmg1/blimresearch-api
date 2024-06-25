import { createQueryVirals } from '../../db/virals'
import {
  getTiktokViralProfiles,
  getTiktokViralVideos
} from '../../libs/apify/tiktok'
import { translateQuery } from '../../libs/openai/translations'

export const getTiktokVirals = async ({
  query,
  language,
  minNumberOfFans,
  userId,
  maxDurationVideo
}: {
  query: string
  language: string
  minNumberOfFans: number
  userId: string
  maxDurationVideo?: number
}) => {
  const translatedQuery = await translateQuery({
    text: query,
    toLanguage: language
  })
  console.log('translatedQuery', translatedQuery)
  const virals = await getTiktokViralVideos({
    query: translatedQuery as string,
    minFans: minNumberOfFans
  })
  console.log('virals', virals)
  const viralProfiles = virals.map((profile) => profile.name)
  console.log('viralProfiles', viralProfiles)
  const profiles = await getTiktokViralProfiles({
    profiles: viralProfiles,
    maxDurationVideo
  })
  console.log('profiles', profiles)
  const languageAdded = profiles
    .filter((profile: any) => profile.videoUrl)
    .map((profile: any) => ({
      ...profile,
      language,
      platform: 'tiktok',
      userId
    }))
  console.log('languageAdded', languageAdded)
  const queryCreated = await createQueryVirals({
    query: query as string,
    language,
    userId,
    viralVideos: languageAdded
  })
  return queryCreated
}
