import { createQueryVirals } from '../../db/virals'
import {
  getYoutubeShortsDataFromQuery,
  getYoutubeShortsDataFromUrl
} from '../../libs/apify/youtube'
import { translateQuery } from '../../libs/openai/translations'
import { YoutubeQueryRun } from '../../types/apify'

const isShort = (url: string) => {
  return url.includes('shorts')
}

export const getYoutubeVirals = async ({
  query,
  language,
  minNumberOfFans,
  userId,
  first10Items
}: {
  query: string
  language: string
  minNumberOfFans?: number
  userId: string
  first10Items?: YoutubeQueryRun[]
}) => {
  const translatedQuery = await translateQuery({
    text: query,
    toLanguage: language
  })
  if (!translatedQuery) {
    throw new Error('Failed to translate query')
  }
  const res = await getYoutubeShortsDataFromQuery({ query: translatedQuery })
  if (!res) {
    throw new Error('No items found')
  }

  const filteredVideos: {
    username: string
    videoViews?: number
    userFans?: number
    language: string
    platform: string
    userId: string
    videoUrl: string
  }[] = res.items
    .map((item) => {
      if (!item.channelName) {
        return null
      }
      return {
        username: item.channelName,
        videoViews: item.viewCount,
        language,
        platform: 'youtube',
        userId,
        videoUrl: item.url
      }
    })
    .filter((item) => item !== null)

  if (filteredVideos.length === 0) {
    throw new Error('No items found')
  }

  const totalItems = filteredVideos.sort((a, b) =>
    b.username.localeCompare(a.username)
  )

  const queryCreated = await createQueryVirals({
    query,
    language,
    viralVideos: totalItems,
    platform: 'youtube',
    userId
  })

  return { totalItems, queryCreated }
}
