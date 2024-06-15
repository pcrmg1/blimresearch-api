import { Request } from 'express'

export interface JwtPayload {
  userId: string
  email: string
  role: 'User' | 'Admin'
}

export interface RequestWithToken extends Request {
  userId?: string
  email?: string
  role?: string
}
