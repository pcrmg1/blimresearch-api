import { promises as fs } from 'fs'

export async function appendToFile(
  filePath: string,
  data: string | object
): Promise<void> {
  try {
    // Open the file in append mode, and create it if it doesn't exist
    const fileOpen = await fs.open(filePath, 'a')

    // Convert object to string if necessary
    const dataToWrite =
      typeof data === 'object' ? JSON.stringify(data, null, 2) : data

    // Append the data to the file
    await fs.appendFile(filePath, `${dataToWrite}\n`)
    console.log('Data appended successfully')
    await fileOpen.close()
  } catch (error) {
    console.error('Error writing to file:', error)
  }
}
