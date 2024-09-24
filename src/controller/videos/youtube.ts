import { createQueryVirals } from '../../db/virals'
import {
  getYoutubeShortsDataFromQuery,
  getYoutubeShortsDataFromUrl
} from '../../libs/apify/youtube'
import { YoutubeQueryRun } from '../../types/apify'

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
  const res = await getYoutubeShortsDataFromQuery({ query })
  if (!res) {
    throw new Error('No items found')
  }
  const channelUrls: string[] = []
  res.items.forEach((item) => {
    if (channelUrls.includes(item.channelUrl)) {
      return
    } else {
      channelUrls.push(item.channelUrl)
    }
  })

  const run = await await getYoutubeShortsDataFromUrl({
    channelUrls: channelUrls.filter((url) => url)
  })

  if (!run) {
    throw new Error('No items found')
  }

  const filteredVideos: {
    username: string
    videoHearts: number
    videoViews: number
    videoComments: number
    userFans?: number
    language: string
    platform: string
    userId: string
    videoUrl: string
  }[] = []

  run.items.forEach((item) => {
    if (minNumberOfFans && item.numberOfSubscribers < minNumberOfFans) {
      return
    } else {
      filteredVideos.push({
        username: item.channelName,
        videoHearts: item.likes,
        videoViews: item.viewCount,
        videoComments: item.commentsCount,
        userFans: item.numberOfSubscribers,
        language,
        platform: 'youtube',
        userId,
        videoUrl: item.url
      })
    }
  })

  first10Items?.forEach((item) => {
    filteredVideos.push({
      username: item.channelName,
      videoHearts: item.likes,
      videoViews: item.viewCount,
      videoComments: item.commentsCount,
      userFans: undefined,
      language,
      platform: 'youtube',
      userId,
      videoUrl: item.url
    })
  })

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
