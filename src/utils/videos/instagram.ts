import { InstagramDataByUsername, InstagramQueryRun } from '../../types/apify'

export const getInstagramUsersFromPosts = ({
  items
}: {
  items: InstagramQueryRun[]
}) => {
  return items.map((item) => item.username)
}

export const formatCarrouselFromInstagram = ({
  data,
  userId
}: {
  data: InstagramDataByUsername[]
  userId: string
}) => {
  const formattedItem = data.map((item) => {
    const { username, followersCount, followsCount, profilePicUrl } = item
    let sidecars = []
    for (const post of item.latestPosts) {
      if (post.type === 'Sidecar') {
        const { likesCount, timestamp, images, url } = post
        sidecars.push({
          likesCount: likesCount ? likesCount : 0,
          timestamp,
          images,
          url
        })
      }
    }
    const sidecarsLikeCount = sidecars.reduce((acc, current) => {
      return acc + current.likesCount
    }, 0)
    return {
      username,
      profilePicUrl,
      followersCount,
      followsCount,
      sidecars,
      sidecarsLikeAverage: sidecarsLikeCount / sidecars.length
    }
  })
  const itemsWithSidecars = formattedItem.filter(
    (item) => item.sidecars.length > 0
  )
  let sidecarsCount = 0
  const possibleViralSidecars = itemsWithSidecars.map((item) => {
    const {
      username,
      followersCount,
      followsCount,
      sidecars,
      profilePicUrl,
      sidecarsLikeAverage
    } = item
    const filteredSidecars = sidecars.filter((sidecar) => sidecar.likesCount)
    sidecarsCount += filteredSidecars.length
    return {
      username,
      profilePicUrl,
      followersCount,
      followsCount,
      sidecars: filteredSidecars,
      sidecarsLikeAverage
    }
  })
  const viralSidecars = possibleViralSidecars.filter(
    (item) => item.sidecars.length > 0
  )

  const viralSidecarsFormatted: {
    likes: number
    timestamp: Date | string
    imagesUrl: any[]
    url: string
    username: string
    user_followers: number
    user_follows: number
    profilePicUrl: string
    userId: string
  }[] = []
  viralSidecars.forEach((item) => {
    const { username, followersCount, followsCount, sidecars, profilePicUrl } =
      item
    sidecars.forEach((sidecar) => {
      const { likesCount, timestamp, images, url } = sidecar
      viralSidecarsFormatted.push({
        likes: likesCount,
        timestamp,
        imagesUrl: images,
        url,
        username,
        user_followers: followersCount,
        user_follows: followsCount,
        profilePicUrl,
        userId
      })
    })
  })
  return { viralSidecars: viralSidecarsFormatted, totalSidecars: sidecarsCount }
}

export const formatVideosFromInstagram = ({
  data,
  userId
}: {
  data: InstagramDataByUsername[]
  userId: string
}) => {
  const formattedItem = data.map((item) => {
    const { username, followersCount, followsCount, profilePicUrl } = item
    let videos = []
    for (const post of item.latestPosts) {
      if (post.type === 'Video') {
        const { likesCount, timestamp, displayUrl, url } = post
        videos.push({
          likesCount: likesCount ? likesCount : 0,
          timestamp,
          displayUrl,
          url
        })
      }
    }
    const videosLikeCount = videos.reduce((acc, current) => {
      return acc + current.likesCount
    }, 0)
    return {
      username,
      profilePicUrl,
      followersCount,
      followsCount,
      videos,
      videosLikeAverage: videosLikeCount / videos.length
    }
  })
  const itemsWithVideos = formattedItem.filter((item) => item.videos.length > 0)
  let videosCount = 0
  const possibleViralVideos = itemsWithVideos.map((item) => {
    const {
      username,
      followersCount,
      followsCount,
      videos,
      profilePicUrl,
      videosLikeAverage
    } = item
    const filteredVideos = videos.filter(
      (video) => video.likesCount > videosLikeAverage * 3
    )
    videosCount += filteredVideos.length
    return {
      username,
      profilePicUrl,
      followersCount,
      followsCount,
      videos: filteredVideos,
      videosLikeAverage
    }
  })
  const viralVideos = possibleViralVideos.filter(
    (item) => item.videos.length > 0
  )

  const viralVideosFormatted: {
    timestamp: Date | string
    videoUrl: string
    username: string
    userFans: number
    videoHearts: number
    userId: string
    platform: string
  }[] = []
  viralVideos.forEach((item) => {
    const { username, followersCount, videos, profilePicUrl } = item
    videos.forEach((video) => {
      const { likesCount, timestamp, url } = video
      viralVideosFormatted.push({
        timestamp,
        videoUrl: url,
        username,
        userFans: followersCount,
        videoHearts: likesCount,
        userId,
        platform: 'instagram'
      })
    })
  })
  return { viralVideos: viralVideosFormatted, totalVideos: videosCount }
}
