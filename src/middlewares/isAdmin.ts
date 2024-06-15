import { Response, NextFunction } from 'express'
import { RequestWithToken } from '../types/jwt'

export function isAdmin(
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) {
  const role = req.role
  if (role === 'Admin') {
    return next()
  }
  return res.status(403).json({ message: 'You are not authorized' })
}
