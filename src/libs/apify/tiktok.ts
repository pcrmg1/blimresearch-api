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
  const COST_PER_ITEM = 0.1 / 1000
  return {
    items: response.items as unknown as TiktokProfileRun[],
    cost: COST_PER_ITEM * response.items.length
  }
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
    const COST_PER_ITEM = 4 / 1000
    return {
      items: response.items as unknown as TiktokQueryRun[],
      cost: COST_PER_ITEM * response.items.length
    }
  } catch (error) {
    console.log('error', error)
    throw new Error('Error al obtener los datos de Tiktok')
  }
}

export const getTiktokDataFromProfilesQuery = async ({
  profiles
}: {
  profiles: string[]
}) => {
  try {
    if (!profiles || profiles.length === 0)
      throw new Error('No se puede hacer la busqueda sin query')
    const input = {
      profiles,
      resultsPerPage: 45,
      shouldDownloadCovers: false,
      shouldDownloadSlideshowImages: false,
      shouldDownloadSubtitles: false,
      shouldDownloadVideos: false
    }
    const run = await apifyClient.actor('OtzYfK1ndEGdwWFKQ').call(input)
    const response = await apifyClient.dataset(run.defaultDatasetId).listItems()
    const COST_PER_ITEM = 0.004
    console.log('response received')
    return {
      items: response.items as unknown as TiktokQueryRun[],
      cost: COST_PER_ITEM * response.items.length
    }
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
  const { items, cost } = await getTiktokDataFromQuery({
    query
  })
  const itemsMapped = formatItemsFromTiktokQueryResponse({ items })

  const filteredUsers = itemsMapped.filter(
    (user) => user.fans > minNumberOfFans
  )

  return { items: filteredUsers, cost }
}

export const getTiktokViralProfiles = async ({
  profiles,
  maxDurationVideo,
  minDurationVideo
}: {
  profiles: string[]
  maxDurationVideo?: number
  minDurationVideo?: number
}) => {
  const { items, cost } = await getTiktokDataFromUsernames({
    usernames: profiles
  })
  const itemsFound = formatItemsFromTiktokUsernamesResponse({ items })

  const videosFound = filterItemsFromTiktokUsernamesResponseByDuration({
    items: itemsFound,
    maxDurationVideos: maxDurationVideo,
    minDurationVideos: minDurationVideo
  })

  const videosGroupedByAuthor = groupItemsFromTiktokUsernamesResponseByAuthor({
    items: videosFound
  })

  const averageByAuthor = getAverageByAuthorFromTiktokUsernamesResponse({
    items: videosGroupedByAuthor
  })

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

  return { items: videos, cost }
}

export const getTiktokViralListFromUsernames = async ({
  usernames,
  listaCreadaPorUsuario
}: {
  usernames: string[]
  listaCreadaPorUsuario?: boolean
}) => {
  const viralVideos = await getTiktokDataFromProfilesQuery({
    profiles: usernames
  })
  const formattedItemOutput = viralVideos.items.map((item) => {
    const {
      commentCount,
      diggCount,
      playCount,
      shareCount,
      webVideoUrl,
      authorMeta,
      collectCount
    } = item
    if (!authorMeta) {
      return {
        name: null,
        userFans: null,
        userHearts: null,
        diggCount,
        shareCount,
        playCount,
        collectCount,
        commentCount,
        webVideoUrl
      }
    } else {
      return {
        name: authorMeta.name,
        userFans: authorMeta.fans,
        userHearts: authorMeta.heart,
        diggCount,
        shareCount,
        playCount,
        collectCount,
        commentCount,
        webVideoUrl
      }
    }
  })
  const filteredItems = formattedItemOutput.filter((item) => item.name !== null)
  const videosGroupedByAuthor = groupItemsFromTiktokUsernamesResponseByAuthor({
    items: filteredItems
  })

  const averageByAuthor = getAverageByAuthorFromTiktokUsernamesResponse({
    items: videosGroupedByAuthor
  })
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

  let videos: {
    username: string
    userFans: number
    userHearts: number
    userHeartsAvg: number
    userPlayAvg: number
    userShareAvg: number
    videoUrl: string
    videoHearts: number
    videoViews: number
    videoShares: number
    videoComments: number
  }[] = []
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
      if (itemInfo.videoViews > itemInfo.userFans && !listaCreadaPorUsuario) {
        videos.push(itemInfo)
      } else {
        videos.push(itemInfo)
      }
    })
    return
  })
  return { cost: viralVideos.cost, videos }
}
