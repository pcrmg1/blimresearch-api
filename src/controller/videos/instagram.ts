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
  userId
}: {
  query: string
  minFollowers: number
  language: string
  minLikes: number
  userId: string
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

    const formattedCarrousels = formatCarrouselFromInstagram({
      data: filteredUsersByMinNumberOfLike,
      userId
    })

    const formattedVideos = formatVideosFromInstagram({
      data: filteredUsersByMinNumberOfLike,
      userId
    })

    return { carrousels: formattedCarrousels, videos: formattedVideos }
  } catch (error) {
    console.log(error)
    throw new Error('Failed to find viral Instagram')
  }
}
