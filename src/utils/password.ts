import bcrypt from 'bcrypt'

const ROUNDS = 10

export const hashPassword = async ({ password }: { password: string }) => {
  return await bcrypt.hash(password, ROUNDS)
}

export const comparePassword = async ({
  password,
  hash
}: {
  password: string
  hash: string
}) => {
  return await bcrypt.compare(password, hash)
}
