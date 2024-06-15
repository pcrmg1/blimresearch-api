import { createCanvas, loadImage } from 'canvas'

export async function mergeTextWithImage(
  imagePath: string,
  text: string
): Promise<Buffer | undefined> {
  try {
    const image = await loadImage(imagePath)
    const width = image.width
    const height = image.height

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, width, height)

    const fontSize = 50
    const fontFamily = 'Montserrat'
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lines = text.split('\n')
    const lineHeight = fontSize * 1.2
    const textHeight = lines.length * lineHeight

    let y = (height - textHeight) / 2 + lineHeight / 2

    lines.forEach((line) => {
      ctx.fillText(line, width / 2, y)
      y += lineHeight
    })

    return canvas.toBuffer('image/png')
  } catch (error) {
    console.error('Error merging text with image:', error)
  }
}
