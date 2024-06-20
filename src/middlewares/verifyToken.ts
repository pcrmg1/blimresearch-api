import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { JwtPayload, RequestWithToken } from '../types/jwt'

const secretKey = process.env.TOKEN_SECRET!!

export function verifyToken(
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) {
  const header = req.header('Authorization') || ''
  const token = header.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' })
  }
  try {
    const payload = jwt.verify(token, secretKey) as JwtPayload
    req.userId = payload.userId
    req.email = payload.email
    req.role = payload.role
    return next()
  } catch (error) {
    console.log('error', error)
    return res.status(403).json({ message: 'Token not valid' })
  }
}
