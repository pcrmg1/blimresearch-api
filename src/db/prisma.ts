import { PrismaClient } from '@prisma/client'

const prismaDB = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn']
      : ['warn']
})

export default prismaDB

async function gracefulShutdown() {
  try {
    await prismaDB.$disconnect()
    console.log('Prisma disconnected')
  } catch (error) {
    console.error('Error disconnecting Prisma:', error)
  }
}

// Handle process signals for graceful shutdown
process.on('disconnect', gracefulShutdown)
process.on('exit', gracefulShutdown)
