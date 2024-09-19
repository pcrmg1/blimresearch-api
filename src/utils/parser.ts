export const getInstagramVideoId = ({ url }: { url: string }) => {
  const shortcode = new URL(url).pathname.split('/')[2]
  return { shortcode }
}

export const getTiktokVideoId = ({ url }: { url: string }) => {
  const id = url?.split('/')[5].split('?')[0] as string
  return { videoId: id }
}
