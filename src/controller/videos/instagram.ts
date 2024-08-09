import { addSpentUSD } from '../../db/user'
import { createCarruselQuery, createQueryVirals } from '../../db/virals'
import {
  getInstagramDataByQuery,
  getInstagramDataByDirectUrl,
  getInstagramDataByUsernames
} from '../../libs/apify/instagram'
import {
  translateInstagramQuery,
  translateQuery,
  translateText
} from '../../libs/openai/translations'
import { formatCurrencyToAddToDB } from '../../utils/currency'
import {
  filterInstagramPostsByLikes,
  getInstagramUsersFromPosts,
  formatCarrouselFromInstagram,
  formatVideosFromInstagram
} from '../../utils/videos/instagram'

export const getInstagramVirals = async ({
  query,
  minFollowers,
  userId,
  language
}: {
  query: string
  minFollowers: number
  userId: string
  language: string
}) => {
  try {
    const queryTranslated = await translateInstagramQuery({
      query,
      toLanguage: language
    })
    if (!queryTranslated) {
      throw new Error('Failed to translate query')
    }

    const foundItemsByQuery = await getInstagramDataByQuery({
      query: queryTranslated
    })

    const filteredUrls = await filterInstagramPostsByLikes({
      items: foundItemsByQuery
    })

    const { items: foundItemsByUrl, cost: costFromDirectURL } =
      await getInstagramDataByDirectUrl({
        directUrls: filteredUrls
      })

    const filteredUsers = await getInstagramUsersFromPosts({
      items: foundItemsByUrl
    })

    const { items: foundItemsByUsernames, cost: costFromUsernames } =
      await getInstagramDataByUsernames({
        usernames: filteredUsers
      })

    const totalCost = formatCurrencyToAddToDB(
      costFromDirectURL + costFromUsernames
    )
    await addSpentUSD({
      userId,
      spentUSD: totalCost
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
