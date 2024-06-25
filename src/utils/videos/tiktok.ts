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
  const itemsFound = items.map((item) => {
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
    return {
      channel,
      likes,
      shares,
      views,
      bookmarks,
      comments,
      postPage,
      video
    }
  })

  if (itemsFound.length === 0) {
    throw new Error('No se encontraron perfiles')
  }
  console.log('itemsFound', itemsFound)
  return itemsFound
}

export const filterItemsFromTiktokUsernamesResponseByDuration = ({
  items,
  maxDurationVideos
}: {
  items: ReturnType<typeof formatItemsFromTiktokUsernamesResponse>
  maxDurationVideos?: number
}) => {
  if (!items) {
    throw new Error('No se encontraron perfiles para formatear')
  }

  return items
    .filter((item) => item?.channel)
    .map((item) => {
      if (!item) {
        return {
          name: null,
          userFans: 0,
          userHearts: 0,
          diggCount: 0,
          shareCount: 0,
          playCount: 0,
          collectCount: 0,
          commentCount: 0,
          webVideoUrl: ''
        }
      }

      const { channel, likes, shares, views, bookmarks, comments, video } = item

      if (maxDurationVideos) {
        if (item?.video.duration < maxDurationVideos) {
          return {
            name: channel.name,
            userFans: channel.followers,
            userHearts: 0,
            diggCount: likes,
            shareCount: shares,
            playCount: views,
            collectCount: bookmarks,
            commentCount: comments,
            webVideoUrl: video.url
          }
        } else {
          return {
            name: null,
            userFans: channel.followers,
            userHearts: 0,
            diggCount: likes,
            shareCount: shares,
            playCount: views,
            collectCount: bookmarks,
            commentCount: comments,
            webVideoUrl: video.url
          }
        }
      } else {
        return {
          name: channel.name,
          userFans: channel.followers,
          userHearts: 0,
          diggCount: likes,
          shareCount: shares,
          playCount: views,
          collectCount: bookmarks,
          commentCount: comments,
          webVideoUrl: video.url
        }
      }
    })
}

export const groupItemsFromTiktokUsernamesResponseByAuthor = ({
  items
}: {
  items: ReturnType<typeof filterItemsFromTiktokUsernamesResponseByDuration>
}) => {
  if (!items) {
    throw new Error('No se encontraron perfiles para agrupar por autor')
  }

  return items
    .filter((item: any) => item.name !== null)
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
