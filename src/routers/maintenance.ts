import { Router } from 'express'
import { config } from 'dotenv'
import { RequestWithToken } from '../types/jwt'
import { getMaintenanceStatus, setMaintenanceStatus } from '../maintenance'
config()

export const maintenanceRouter = Router()

maintenanceRouter.get('/', async (req, res) => {
  const isInMaintenance = await getMaintenanceStatus()
  console.log('inMaintenance', isInMaintenance)
  res.json({
    isInMaintenance
  })
})

maintenanceRouter.post('/', async (req: RequestWithToken, res) => {
  const isAdmin = req.role === 'Admin'
  const { serverStatus } = req.body
  if (!isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  if (!serverStatus) {
    return res.status(400).json({ message: 'Server status not provided' })
  }
  process.env.MAINTENANCE_STATUS = serverStatus
  await setMaintenanceStatus(serverStatus)
  res.json({ message: 'Server status updated' })
})
