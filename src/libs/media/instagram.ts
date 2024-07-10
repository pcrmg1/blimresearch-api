const instagramDl = require('@sasmeee/igdl')

export const getInstagramVideoURL = async ({ url }: { url: string }) => {
  try {
    const res = await instagramDl(url)
    return res[0].download_link
  } catch (error) {
    console.error(error)
  }
}
