import { Router } from 'express'
import { config } from 'dotenv'
import { RequestWithToken } from '../types/jwt'
import { getMaintenanceStatus, setMaintenanceStatus } from '../maintenance'
config()

export const maintenanceRouter = Router()

maintenanceRouter.get('/', async (req, res) => {
  const isInMaintenance = await getMaintenanceStatus()
  return res.json({
    isInMaintenance
  })
})

maintenanceRouter.post('/', async (req: RequestWithToken, res) => {
  const isAdmin = req.role === 'Admin'
  const { inMaintenance } = req.body
  if (!isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  if (!inMaintenance) {
    return res.status(400).json({ message: 'Server status not provided' })
  }
  process.env.MAINTENANCE_STATUS = inMaintenance
  await setMaintenanceStatus(inMaintenance)
  return res.json({ message: 'Server status updated' })
})
