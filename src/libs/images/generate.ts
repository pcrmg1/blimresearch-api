import { createCanvas, loadImage } from "canvas";

export async function mergeTextWithImage(
  imagePath: string,
  text: string,
  options: any,
): Promise<Buffer | undefined> {
  try {
    const image = await loadImage(imagePath);
    const { width, height } = image;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, width, height);

    const {
      fontSize = 50,
      fontFamily = "Montserrat",
      textAlign = "center",
      fillStyle = "#333",
      textBaseline = "middle",
    } = options;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;

    const lines = text.split("\n");
    const lineHeight = fontSize * 1.2;
    const textHeight = lines.length * lineHeight;

    let y = (height - textHeight) / 2 + lineHeight / 2;

    let maxLineWidth = 0;
    lines.forEach((line) => {
      const lineWidth = ctx.measureText(line).width;
      if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
      }
    });

    lines.forEach((line) => {
      let x;
      switch (textAlign) {
        case "start":
          x = width / 2 - maxLineWidth / 2;
          break;
        case "end":
          x = width / 2 + maxLineWidth / 2;
          break;
        case "center":
        default:
          x = width / 2;
      }

      ctx.fillText(line, x, y);
      y += lineHeight;
    });

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.error("Error merging text with image:", error);
  }
}
