import { TiktokProfileRun, TiktokQueryRun } from '../../types/apify'

export const formatItemsFromTiktokQueryResponse = ({
  items
}: {
  items: TiktokQueryRun[]
}) => {
  const PLAY_COUNT_VALUE = 1
  const LIKE_COUNT_VALUE = 3
  const COMMENT_COUNT_VALUE = 5
  const SHARE_COUNT_VALUE = 7

  const itemsMapped = items.map((item: any) => {
    const { diggCount, shareCount, playCount, commentCount, webVideoUrl } = item
    const {
      name,
      fans,
      signature,
      nickName,
      following: authorFollowing,
      heart: authorHeart,
      digg: authorDigg
    } = item.authorMeta
    const totalValue =
      diggCount * LIKE_COUNT_VALUE +
      shareCount * SHARE_COUNT_VALUE +
      playCount * PLAY_COUNT_VALUE +
      commentCount * COMMENT_COUNT_VALUE
    return {
      name: name,
      fans: fans,
      signature: signature,
      nickName: nickName,
      webVideoUrl: webVideoUrl,
      diggCount: diggCount,
      shareCount: shareCount,
      playCount: playCount,
      commentCount: commentCount,
      totalValue: totalValue,
      authorFollowing: authorFollowing,
      authorHeart: authorHeart,
      authorDigg: authorDigg,
      ratioFans: Number((playCount / fans).toFixed(2))
    }
  })
  return itemsMapped
}

export const formatItemsFromTiktokUsernamesResponse = ({
  items
}: {
  items: TiktokProfileRun[]
}) => {
  const itemsFound = items.map((item: any) => {
    const { username, avatar, followers, following, videos, url } = item
    return {
      tiktok_username: username,
      tiktok_profilePicUrl: avatar,
      tiktok_followers: followers,
      tiktok_following: following,
      tiktok_postsCount: videos,
      tiktok_profileUrl: url
    }
  })

  const foundItems = items.map((username) => {
    return itemsFound.find((item: any) => item.tiktok_username === username)
  })

  if (foundItems.length === 0) {
    throw new Error('No se encontraron perfiles')
  }
  return foundItems
}

export const filterItemsFromTiktokUsernamesResponseByDuration = ({
  items,
  maxDurationVideos
}: {
  items: ReturnType<typeof formatItemsFromTiktokUsernamesResponse>
  maxDurationVideos?: number
}) => {
  return items
    .filter((item: any) => item.channel)
    .map((item: any) => {
      const {
        channel,
        likes,
        shares,
        views,
        bookmarks,
        comments,
        postPage,
        video
      } = item
      const { name, followers } = channel
      if (maxDurationVideos) {
        if (video.duration < maxDurationVideos) {
          console.log({ name, videoDuration: true })
          return {
            name: name,
            userFans: followers,
            userHearts: 0,
            diggCount: likes,
            shareCount: shares,
            playCount: views,
            collectCount: bookmarks,
            commentCount: comments,
            webVideoUrl: postPage
          }
        } else {
          return {
            name: null,
            userFans: followers,
            userHearts: 0,
            diggCount: likes,
            shareCount: shares,
            playCount: views,
            collectCount: bookmarks,
            commentCount: comments,
            webVideoUrl: postPage
          }
        }
      } else {
        return {
          name: name,
          userFans: followers,
          userHearts: 0,
          diggCount: likes,
          shareCount: shares,
          playCount: views,
          collectCount: bookmarks,
          commentCount: comments,
          webVideoUrl: postPage
        }
      }
    })
}

export const groupItemsFromTiktokUsernamesResponseByAuthor = ({
  items
}: {
  items: ReturnType<typeof filterItemsFromTiktokUsernamesResponseByDuration>
}) => {
  return items
    .filter((item) => item.name !== null)
    .reduce((acc: any, currentProfile) => {
      const existsProfile = acc.find(
        (profile: any) => profile.name === currentProfile.name
      )
      const {
        name,
        collectCount,
        commentCount,
        diggCount,
        playCount,
        shareCount,
        userFans,
        userHearts,
        webVideoUrl
      } = currentProfile
      if (!existsProfile) {
        acc.push({
          name,
          userFans,
          userHearts,
          videos: [
            {
              collectCount,
              commentCount,
              diggCount,
              playCount,
              shareCount,
              webVideoUrl
            }
          ]
        })
        return acc
      } else {
        existsProfile.videos.push({
          collectCount,
          commentCount,
          diggCount,
          playCount,
          shareCount,
          webVideoUrl
        })
        return acc
      }
    }, [])
}

export const getAverageByAuthorFromTiktokUsernamesResponse = ({
  items
}: {
  items: ReturnType<typeof groupItemsFromTiktokUsernamesResponseByAuthor>
}) => {
  return items.map((profile: any) => {
    const { name, userFans, userHearts, videos } = profile
    const totalVideos = videos.length
    const totalValues = videos.reduce(
      (acc: any, currentVideo: any) => {
        const { collectCount, commentCount, diggCount, playCount, shareCount } =
          currentVideo
        acc.collectCount += collectCount
        acc.commentCount += commentCount
        acc.diggCount += diggCount
        acc.playCount += playCount
        acc.shareCount += shareCount
        return acc
      },
      {
        collectCount: 0,
        commentCount: 0,
        diggCount: 0,
        playCount: 0,
        shareCount: 0
      }
    )
    const averageValues = {
      collectCount: totalValues.collectCount / totalVideos,
      commentCount: totalValues.commentCount / totalVideos,
      diggCount: totalValues.diggCount / totalVideos,
      playCount: totalValues.playCount / totalVideos,
      shareCount: totalValues.shareCount / totalVideos
    }
    return {
      name,
      userFans,
      userHearts,
      averageValues
    }
  })
}
