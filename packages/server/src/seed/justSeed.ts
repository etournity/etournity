import { PrismaClient } from '@prisma/client'
import { seed } from './seed'

const prisma = new PrismaClient()

seed(prisma, true).catch((e) => console.error(e))
