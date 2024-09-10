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
      console.log(
        'Checking sidecar: ',
        sideCar.id,
        sideCar.ownerUsername,
        sideCar.likesCount && sideCar.likesCount > sideCarsAverageLikes * 3
      )
      if (sideCar.likesCount && sideCar.likesCount > sideCarsAverageLikes * 3) {
        viralSidecars.push({ ...sideCar, sideCarsAverageLikes })
      }
    }
    for (const video of videos) {
      console.log(
        'Checking video: ',
        video.id,
        video.likesCount,
        video.ownerUsername,
        videosAverageLikes,
        video.likesCount && video.likesCount > videosAverageLikes * 3
      )
      if (video.likesCount && video.likesCount > videosAverageLikes * 3) {
        viralVideos.push({ ...video, videosAverageLikes })
      }
    }
  }

  const totalSidecars: {
    timestamp: string | undefined | Date
    username: string
    likes: number | undefined
    imagesUrl: string[]
    url: string
  }[] = []
  viralSidecars.forEach((sidecar) => {
    const {
      timestamp,
      ownerUsername,
      images,
      url,
      likesCount,
      sideCarsAverageLikes
    } = sidecar
    if (ownerUsername) {
      totalSidecars.push({
        timestamp: timestamp ? timestamp : undefined,
        username: ownerUsername,
        likes: likesCount ? likesCount : undefined,
        imagesUrl: images,
        url: url
      })
    }
  })

  const totalVideos: {
    timestamp: string | undefined | Date
    username: string
    videoHearts: number | undefined
    videoComments: number | undefined
    videoUrl: string
    userPlayAvg: number | undefined
  }[] = []
  viralVideos.forEach((video) => {
    const {
      timestamp,
      ownerUsername,
      likesCount,
      commentsCount,
      url,
      videosAverageLikes
    } = video
    if (ownerUsername) {
      totalVideos.push({
        timestamp: timestamp ? timestamp : undefined,
        username: ownerUsername,
        videoHearts: likesCount ? likesCount : undefined,
        videoComments: commentsCount,
        videoUrl: url,
        userPlayAvg: videosAverageLikes
      })
    }
  })

  return {
    cost,
    totalSidecars,
    totalVideos
  }
}
