import { PrismaClient, User } from '@prisma/client'
import { PubSubHandler } from './helpers/pubSubHelper'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export interface Context {
  prisma: PrismaClient
  user: User
  pubsub: PubSubHandler
}

export interface MockContext {
  prisma: DeepMockProxy<PrismaClient>
  user: DeepMockProxy<User>
  pubsub: DeepMockProxy<PubSubHandler>
}

export const createMockContext = (): MockContext => ({
  prisma: mockDeep<PrismaClient>(),
  user: mockDeep<User>(),
  pubsub: mockDeep<PubSubHandler>(),
})
