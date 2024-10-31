export function formatearGuionSplitWithPoint({
  text
}: {
  text: string | null
}) {
  if (!text) {
    return ''
  }
  let guion: string = ''
  const guionSplit = text.split('.')
  for (let i = 0; i < guionSplit.length; i += 2) {
    guion += guionSplit[i] + '.' + guionSplit[i + 1] + '.' + '\n' + '\n'
  }
  return guion
}
