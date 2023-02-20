import { PrismaClient } from '@prisma/client'
import { PubSubHandler } from './helpers/pubSubHelper'
import Mixpanel from 'mixpanel'

export const REDIS_HOST = process.env.REDIS_URL ?? 'localhost'
export const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT ?? '6379', 10)
export const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
})

export const pubsub = new PubSubHandler()

if (!process.env.MIXPANEL_TOKEN)
  console.error('Missing Mixpanel analytics token!')

export const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN ?? '', {
  host: 'api-eu.mixpanel.com',
})
