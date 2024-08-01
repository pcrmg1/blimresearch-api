import fs from 'fs/promises'
import dotenv from 'dotenv'
import path from 'node:path'

const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath })

export async function setMaintenanceStatus(value: string): Promise<void> {
  try {
    const envFileContent = await fs.readFile(envPath, 'utf-8')
    const envConfig = dotenv.parse(envFileContent)

    envConfig.MAINTENANCE_STATUS = value

    const updatedEnv = Object.entries(envConfig)
      .map(([key, val]) => `${key}=${val}`)
      .join('\n')

    await fs.writeFile(envPath, updatedEnv)
  } catch (error) {
    console.error('Error updating the .env file:', error)
  }
}

export const getMaintenanceStatus = async (): Promise<string> => {
  try {
    const envFileContent = await fs.readFile(envPath, 'utf-8')
    const envConfig = dotenv.parse(envFileContent)
    return envConfig.MAINTENANCE_STATUS
  } catch (error) {
    console.error('Error reading the .env file:', error)
    return 'false'
  }
}
