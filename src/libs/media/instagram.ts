import { getInstagramVideoId } from '../../utils/parser'
import { getInstagramDataForOneUrl } from '../apify/instagram'

export const getInstagramVideoURL = async ({ url }: { url: string }) => {
  try {
    const res = await getInstagramDataForOneUrl({ url })
    const { type } = res
    if (type !== 'Video') {
      throw new Error(
        'No se encontro el video o el link proporcionado no corresponde a uno'
      )
    }
    if (!res.videoUrl) {
      throw new Error('No se encontro el video')
    }
    return res.videoUrl
  } catch (error) {
    console.error(error)
  }
}

export const getCarruselImgUrls = async (url: string) => {
  try {
    const urlLists: string[] = []
    const res = await getInstagramDataForOneUrl({ url })
    if (res.type !== 'Sidecar' && res.type !== 'Image') {
      throw new Error(
        'El link proporcionado no corresponde a un carrusel o una imagen'
      )
    }
    if (res.type === 'Image') {
      urlLists.push(res.displayUrl)
      return { urlLists, url: res.url, username: res.ownerUsername }
    }
    for (const url of res.images) {
      urlLists.push(url)
    }
    return { urlLists, url: res.url, username: res.ownerUsername }
  } catch (error) {
    console.error({ error })
  }
}

export const getInstagramVideoCaption = async ({ url }: { url: string }) => {
  try {
    const res = await getInstagramDataForOneUrl({ url })
    const { shortcode } = getInstagramVideoId({ url })
    const { type } = res
    if (type !== 'Video') {
      throw new Error(
        'No se encontro el video o el link proporcionado no corresponde a uno'
      )
    }
    if (!res.videoUrl) {
      throw new Error('No se encontro el video')
    }
    return { displayUrl: res.displayUrl, shortcode }
  } catch (error) {
    console.error(error)
  }
}
