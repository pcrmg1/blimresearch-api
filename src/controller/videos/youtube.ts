import { createQueryVirals } from '../../db/virals'
import {
  getYoutubeShortsDataFromQuery,
  getYoutubeShortsDataFromUrl
} from '../../libs/apify/youtube'

export const getYoutubeVirals = async ({
  query,
  language,
  minNumberOfFans,
  userId
}: {
  query: string
  language: string
  minNumberOfFans?: number
  userId: string
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

  const itemsGrouppedByAuthor = run.items.reduce(
    (acc, item) => {
      if (!acc[item.channelName]) {
        acc[item.channelName] = []
      }
      const {
        channelName,
        likes,
        viewCount,
        commentsCount,
        numberOfSubscribers,
        url
      } = item
      if (minNumberOfFans && numberOfSubscribers < minNumberOfFans) {
        return acc
      }
      acc[item.channelName].push({
        username: channelName,
        videoHearts: likes,
        videoViews: viewCount,
        videoComments: commentsCount,
        userFans: numberOfSubscribers,
        language,
        platform: 'youtube',
        userId,
        videoUrl: url
      })
      return acc
    },
    {} as Record<
      string,
      {
        username: string
        videoHearts: number
        videoViews: number
        videoComments: number
        userFans: number
        language: string
        platform: string
        userId: string
        videoUrl: string
      }[]
    >
  )
  const filteredVideos: {
    username: string
    videoHearts: number
    videoViews: number
    videoComments: number
    userFans: number
    language: string
    platform: string
    userId: string
    videoUrl: string
  }[] = []
  for (const key in itemsGrouppedByAuthor) {
    const totalChannelViews = itemsGrouppedByAuthor[key].reduce(
      (acc, item) => acc + item.videoViews,
      0
    )
    itemsGrouppedByAuthor[key].forEach((video) => {
      if (
        video.videoViews >=
        (3 * totalChannelViews) / itemsGrouppedByAuthor[key].length
      ) {
        filteredVideos.push(video)
      }
    })
  }
  const queryCreated = await createQueryVirals({
    query,
    language,
    viralVideos: filteredVideos,
    platform: 'youtube',
    userId
  })
  return filteredVideos
}
