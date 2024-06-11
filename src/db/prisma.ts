import { PrismaClient } from '@prisma/client'

const prismaDB = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn']
      : ['warn']
})

export default prismaDB

process.on('exit', async () => {
  await prismaDB.$disconnect()
})
