import jwt from 'jsonwebtoken'

const secretKey = process.env.TOKEN_SECRET!!

export const signToken = ({
  email,
  role,
  userId
}: {
  email: string
  role: 'User' | 'Admin'
  userId: string
}) => {
  return jwt.sign({ email, role, userId }, secretKey, { expiresIn: '24h' })
}
