import { TiktokProfileRun, TiktokQueryRun } from '../../types/apify'
import { apifyClient } from './client'
import {
  filterItemsFromTiktokUsernamesResponseByDuration,
  formatItemsFromTiktokQueryResponse,
  formatItemsFromTiktokUsernamesResponse,
  getAverageByAuthorFromTiktokUsernamesResponse,
  groupItemsFromTiktokUsernamesResponseByAuthor
} from '../../utils/videos/tiktok'

export const getTiktokDataFromUsernames = async ({
  usernames
}: {
  usernames: string[]
}) => {
  const input = {
    customMapFunction: (object: any) => {
      return object
    },
    maxItems: 1000,
    maxPostsPerQuery: 1,
    usernames
  }
  console.log('Starting tiktok Run')
  const run = await apifyClient.actor('ssOXktOBaQQiYfhc4').call(input)
  const response = await apifyClient.dataset(run.defaultDatasetId).listItems()
  return response.items as unknown as TiktokProfileRun[]
}

export const getTiktokDataFromQuery = async ({ query }: { query: string }) => {
  try {
    if (!query || query.length === 0)
      throw new Error('No se puede hacer la busqueda sin query')
    if (typeof query !== 'string')
      throw new Error('La busqueda debe ser una cadena de texto')
    const input = {
      resultsPerPage: 15,
      searchQueries: [query],
      shouldDownloadCovers: false,
      shouldDownloadSlideshowImages: false,
      shouldDownloadSubtitles: false,
      shoulddownloadInstagramVideos: false
    }
    const run = await apifyClient.actor('OtzYfK1ndEGdwWFKQ').call(input)
    const response = await apifyClient.dataset(run.defaultDatasetId).listItems()
    console.log('response received')
    return response.items as unknown as TiktokQueryRun[]
  } catch (error) {
    console.log('error', error)
    throw new Error('Error al obtener los datos de Tiktok')
  }
}

export const getTiktokViralVideos = async ({
  query,
  minFans
}: {
  query: string
  minFans: number
}) => {
  const minNumberOfFans = minFans ? minFans : 1000
  const items = await getTiktokDataFromQuery({
    query
  })
  const itemsMapped = formatItemsFromTiktokQueryResponse({ items })

  const filteredUsers = itemsMapped.filter(
    (user) => user.fans > minNumberOfFans
  )
  const sortedItems = [...filteredUsers].sort(
    (a: any, b: any) => b.ratioFans - a.ratioFans
  )
  return sortedItems
}

export const getTiktokViralProfiles = async ({
  profiles,
  maxDurationVideo
}: {
  profiles: string[]
  maxDurationVideo?: number
}) => {
  const items = await getTiktokDataFromUsernames({ usernames: profiles })
  const itemsFound = formatItemsFromTiktokUsernamesResponse({ items })

  const videosFound = filterItemsFromTiktokUsernamesResponseByDuration({
    items: itemsFound,
    maxDurationVideos: maxDurationVideo
  })

  console.log('videosFound', videosFound)

  const videosGroupedByAuthor = groupItemsFromTiktokUsernamesResponseByAuthor({
    items: videosFound
  })

  console.log('videosGroupedByAuthor', videosGroupedByAuthor)

  const averageByAuthor = getAverageByAuthorFromTiktokUsernamesResponse({
    items: videosGroupedByAuthor
  })

  console.log('averageByAuthor', averageByAuthor)

  const viralVideosGrouped = videosGroupedByAuthor.map((profile: any) => {
    const { name, userFans, userHearts, videos } = profile
    const averagesThisUsername = averageByAuthor.find(
      (author: any) => author.name === name
    )
    const viralVideos = videos.filter((video: any) => {
      const { diggCount } = video
      const diggMinValue = averagesThisUsername.averageValues.diggCount * 3
      return diggCount > diggMinValue
    })
    return {
      name,
      userFans,
      userHearts,
      averageValues: { ...averagesThisUsername.averageValues },
      viralVideos
    }
  })

  console.log('viralVideosGrouped', viralVideosGrouped)

  let videos: any = []
  viralVideosGrouped.forEach((item: any) => {
    const { name, userFans, userHearts, averageValues, viralVideos } = item
    viralVideos.forEach((video: any) => {
      const { commentCount, diggCount, playCount, shareCount, webVideoUrl } =
        video
      const itemInfo = {
        username: name,
        userFans,
        userHearts,
        userHeartsAvg: averageValues.diggCount,
        userPlayAvg: averageValues.playCount,
        userShareAvg: averageValues.shareCount,
        videoUrl: webVideoUrl,
        videoHearts: diggCount,
        videoViews: playCount,
        videoShares: shareCount,
        videoComments: commentCount
      }
      if (itemInfo.videoViews > itemInfo.userFans) {
        videos.push(itemInfo)
      }
    })
    return
  })

  console.log('videos', videos)
  return videos
}
