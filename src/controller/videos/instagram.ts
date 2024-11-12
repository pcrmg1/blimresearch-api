import { addSpentUSD } from '../../db/user'
import { createCarruselQuery, createQueryVirals } from '../../db/virals'
import {
  getInstagramDataByQuery,
  getInstagramDataByUsernames
} from '../../libs/apify/instagram'
import { translateInstagramQuery } from '../../libs/openai/translations'
import { formatCurrencyToAddToDB } from '../../utils/currency'
import {
  formatCarrouselFromInstagram,
  formatVideosFromInstagram,
  getInstagramUsersFromPosts
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

    const filteredUrls = getInstagramUsersFromPosts({
      items: foundItemsByQuery
    })

    const { items: foundItemsByUsernames, cost: costFromUsernames } =
      await getInstagramDataByUsernames({
        usernames:
          filteredUrls.length > 40 ? filteredUrls.slice(0, 40) : filteredUrls
      })

    const totalCost = formatCurrencyToAddToDB(costFromUsernames)
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
