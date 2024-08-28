import { getInstagramDataByUsernames } from '../libs/apify/instagram'
import {
  formatCarrouselFromInstagram,
  formatVideosFromInstagram
} from '../utils/videos/instagram'

export const getInstagramViralsFromUsernamesList = async ({
  usernames,
  userId
}: {
  usernames: string[]
  userId: string
}) => {
  const { cost, items } = await getInstagramDataByUsernames({ usernames })

  const { totalSidecars, viralSidecars } = formatCarrouselFromInstagram({
    data: items,
    userId
  })

  const { totalVideos, viralVideos } = formatVideosFromInstagram({
    data: items,
    userId
  })

  return { cost, totalSidecars, viralSidecars, totalVideos, viralVideos }
}
