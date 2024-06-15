export const parseImageTranscription = ({
  transcription
}: {
  transcription: string | null | undefined
}) => {
  if (!transcription) return
  /// @ts-ignore-next-line
  const jsonString = transcription.match(/```json\n(.*?)```/s)[1]
  const cleanedJsonString = jsonString
    .replace(/\\"/g, '"')
    .replace(/\\\\n/g, '\\n')
  const data = JSON.parse(cleanedJsonString)
  return data
}
