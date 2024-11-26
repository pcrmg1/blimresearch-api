import { promises as fs } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export async function getMediaDuration(filePath: string): Promise<number> {
  try {
    // Use ffprobe to get duration in seconds, output as JSON
    const { stdout } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format "${filePath}"`
    )

    const metadata = JSON.parse(stdout)
    const duration = parseFloat(metadata.format.duration)

    if (isNaN(duration)) {
      throw new Error('Could not determine media duration')
    }

    return duration
  } catch (error) {
    console.error('Error getting media duration:', error)
    throw error
  }
}
