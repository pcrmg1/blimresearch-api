const instagramGetUrl = require('instagram-url-direct')

interface InstagramResponse {
  results_number: number
  url_list: string[]
}

export const getInstagramVideoURL = async ({ url }: { url: string }) => {
  try {
    const res = (await instagramGetUrl(url)) as unknown as InstagramResponse
    return res.url_list[0]
  } catch (error) {
    console.error(error)
  }
}

export const getCarruselImgUrls = async (url: string) => {
  try {
    const res = (await instagramGetUrl(url)) as unknown as InstagramResponse
    console.log(res)
    return res.url_list
  } catch (error) {
    console.error(error)
  }
}
