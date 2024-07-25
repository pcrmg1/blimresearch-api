import { createCarruselQuery, createQueryVirals } from '../../db/virals'
import {
  getInstagramDataByQuery,
  getInstagramDataByDirectUrl,
  getInstagramDataByUsernames
} from '../../libs/apify/instagram'
import {
  filterInstagramPostsByLikes,
  getInstagramUsersFromPosts,
  formatCarrouselFromInstagram,
  formatVideosFromInstagram
} from '../../utils/videos/instagram'

export const getInstagramVirals = async ({
  query,
  minFollowers,
  minLikes,
  userId,
  language
}: {
  query: string
  minFollowers: number
  minLikes: number
  userId: string
  language: string
}) => {
  try {
    const foundItemsByQuery = await getInstagramDataByQuery({ query })
    const filteredUrls = await filterInstagramPostsByLikes({
      items: foundItemsByQuery,
      minNumberOfLikes: minLikes
    })
    const foundItemsByUrl = await getInstagramDataByDirectUrl({
      directUrls: filteredUrls
    })
    const filteredUsers = await getInstagramUsersFromPosts({
      items: foundItemsByUrl
    })
    const foundItemsByUsernames = await getInstagramDataByUsernames({
      usernames: filteredUsers
    })

    const filteredUsersByMinNumberOfLike = foundItemsByUsernames.filter(
      (item) => item.followersCount > minFollowers
    )

    const { totalSidecars, viralSidecars } = formatCarrouselFromInstagram({
      data: filteredUsersByMinNumberOfLike,
      userId
    })

    const { totalVideos, viralVideos } = formatVideosFromInstagram({
      data: filteredUsersByMinNumberOfLike,
      userId
    })

    const carruselQuery = await createCarruselQuery({
      query,
      userId,
      language,
      carruseles: viralSidecars
    })

    const videoQuery = await createQueryVirals({
      query,
      userId,
      language,
      viralVideos: viralVideos,
      platform: 'instagram'
    })

    return {
      carrousels: { totalSidecars, carruselQuery },
      videos: { totalVideos, videoQuery }
    }
  } catch (error) {
    console.log(error)
    throw new Error('Failed to find viral Instagram')
  }
}
