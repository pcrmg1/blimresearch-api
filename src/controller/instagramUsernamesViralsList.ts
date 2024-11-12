import { getInstagramDataByDirectUrl } from '../libs/apify/instagram'

export const getInstagramViralsFromUsernamesList = async ({
  usernames,
  userId
}: {
  usernames: string[]
  userId: string
}) => {
  const urls = usernames.map(
    (username) => `https://www.instagram.com/${username}/`
  )
  const { cost, items } = await getInstagramDataByDirectUrl({
    directUrls: urls,
    resultsLimit: 30
  })

  const itemsGrouppedByAuthor = items.reduce((acc, item) => {
    const author = item.ownerUsername
    if (!author) {
      return acc
    }
    if (!acc[author]) {
      acc[author] = [item]
    } else {
      acc[author] = [...acc[author], item]
    }
    return acc
  }, {} as Record<string, typeof items>)

  const viralSidecars = []
  const viralVideos = []

  for (const authorItems of Object.values(itemsGrouppedByAuthor)) {
    const sideCars = []
    const videos = []
    let sidecarsLikesCount = 0
    let videosLikesCount = 0
    for (const item of authorItems) {
      const existsAuthor = usernames.find(
        (username) => username === item.ownerUsername
      )
      if (item.type === 'Sidecar' && existsAuthor) {
        sideCars.push(item)
        if (item.likesCount) {
          sidecarsLikesCount += item.likesCount
        }
      } else if (item.type === 'Video' && existsAuthor) {
        videos.push(item)
        if (item.likesCount) {
          videosLikesCount += item.likesCount
        }
      }
    }
    const sideCarsAverageLikes = sidecarsLikesCount / sideCars.length
    const videosAverageLikes = videosLikesCount / videos.length
    for (const sideCar of sideCars) {
      const { likesCount, ownerUsername, ...rest } = sideCar
      if (likesCount && likesCount > sideCarsAverageLikes * 3) {
        viralSidecars.push({
          likesCount,
          username: ownerUsername,
          ...rest,
          sideCarsAverageLikes
        })
      }
    }
    for (const video of videos) {
      const { likesCount, ownerUsername, ...rest } = video
      if (likesCount && likesCount > videosAverageLikes * 3) {
        viralVideos.push({
          likesCount,
          username: ownerUsername,
          ...rest,
          videosAverageLikes
        })
      }
    }
  }

  return {
    cost,
    totalSidecars: viralSidecars,
    totalVideos: viralVideos
  }
}
