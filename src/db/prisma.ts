import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  // new PrismaClient({
  //   log: ['query'],
  // }
  new PrismaClient()

process.on('SIGINT', function () {
  prisma.$disconnect()
  process.exit(1)
})
