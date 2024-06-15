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
  const virals = await getTiktokViralVideos({
    query: translatedQuery as string,
    minFans: minNumberOfFans
  })
  const viralProfiles = virals.map((profile) => profile.name)
  const profiles = await getTiktokViralProfiles({
    profiles: viralProfiles,
    maxDurationVideo
  })
  const languageAdded = profiles
    .filter((profile: any) => profile.videoUrl)
    .map((profile: any) => ({
      ...profile,
      language,
      userId
    }))
  // const queryCreated = await createQuery({
  //   query: query as string,
  //   language,
  //   userId,
  //   viralVideos: languageAdded
  // })
  return languageAdded
}
