import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

const secretKey = process.env.TOKEN_SECRET!!
const ONE_DAY = 1000 * 60 * 60 * 24

export const signToken = ({
  email,
  role,
  userId
}: {
  email: string
  role: 'User' | 'Admin'
  userId: string
}) => {
  return jwt.sign({ email, role, userId }, secretKey, { expiresIn: ONE_DAY })
}
