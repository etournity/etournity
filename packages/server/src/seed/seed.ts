import { PrismaClient } from '@prisma/client'
import { seedDeploy } from './deploy'
import { seedDev } from './dev'

export const seed = async (prisma: PrismaClient, isLocal: boolean) => {
  await seedDeploy(prisma)

  if (isLocal) {
    await seedDev(prisma)
  }
}
