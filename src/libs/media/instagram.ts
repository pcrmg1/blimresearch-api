const instagramDl = require('@sasmeee/igdl')

export const getInstagramVideoURL = async ({ url }: { url: string }) => {
  try {
    const res = await instagramDl(url)
    return res[0].download_link
  } catch (error) {
    console.error(error)
  }
}

export const getCarruselImgUrls = async ({ url }: { url: string }) => {
  try {
    const res = await instagramDl(url)
    return res as { download_link: string; thumbnail_link: string }[]
  } catch (error) {
    console.error(error)
  }
}
