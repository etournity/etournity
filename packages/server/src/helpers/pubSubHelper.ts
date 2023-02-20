import { RedisPubSub as PubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'
import { REDIS_HOST, REDIS_PORT } from '../globals'
import { Logger } from '../logger'

const logger = new Logger('redis')

interface PubSubHandlerInterface extends Omit<PubSub, 'publish'> {
  publish: (
    namespace: string,
    namespaceId: string | undefined | null,
    action: string,
    extra?: Record<string, unknown>,
    updateAll?: boolean
  ) => Promise<void>
}

export class PubSubHandler implements PubSubHandlerInterface {
  options: Redis.RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  }

  pubsub = new PubSub({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publisher: new Redis(this.options) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriber: new Redis(this.options) as any,
  })

  private _userId: string | null = null

  public publish(
    namespace: string,
    namespaceId: string | undefined | null,
    action: string,
    extra?: Record<string, unknown>,
    updateAll?: boolean
  ) {
    logger.debug(`Publishing ${namespace}(${namespaceId}):${action}`)
    return this.pubsub.publish(namespace, {
      namespaceId,
      action,
      extra,
      userId: this._userId,
      updateAll,
    })
  }

  public get userId() {
    return this._userId
  }

  public set userId(userId: string | null) {
    this._userId = userId
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public subscribe(triggerName: string, onMessage: (...args: any[]) => void) {
    return this.pubsub.subscribe(triggerName, onMessage)
  }

  public unsubscribe(subId: number) {
    return this.pubsub.unsubscribe(subId)
  }

  public asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.pubsub.asyncIterator(triggers)
  }

  public getSubscriber() {
    return this.pubsub.getSubscriber()
  }

  public getPublisher() {
    return this.pubsub.getPublisher()
  }

  public close() {
    return this.pubsub.close()
  }
}
