import { RequestHandler } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import Redis from 'ioredis'
import { verify } from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-errors'
import { Logger } from './logger'
import { REDIS_URL } from './globals'
import { extractJWT } from './helpers/cookies'

const logger = new Logger('ratelimit')

const redis = new Redis(REDIS_URL, {
  enableOfflineQueue: false,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})

const globalRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'global',
  points: 60,
  duration: 3,
})

export const globalRateLimiterMiddleware: RequestHandler = (req, res, next) => {
  const jwt = extractJWT(req.headers.cookie)

  try {
    const { JWT_SECRET } = process.env

    if (!JWT_SECRET) throw new Error('JWT_SECRET env variable has to be set.')
    try {
      if (jwt) verify(jwt, JWT_SECRET)
    } catch {
      logger.error('Invalid JWT token in payload!')
      throw new AuthenticationError('Invalid JWT token in payload!')
    }

    const ip = req.headers['x-forwarded-for']?.[0] ?? req.ip

    globalRateLimiter
      .consume(jwt ? jwt : ip)
      .then(() => {
        next()
      })
      .catch(() => {
        if (jwt) {
          logger.error(`Too Many Requests for jwt ${jwt}`)
          res.status(429).json({ error: `Too Many Requests for jwt ${jwt}` })
        } else {
          logger.error(`Too Many Requests for ip ${ip}`)
          res.status(429).json({ error: `Too Many Requests for ip ${ip}` })
        }
      })
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.error(`Error when trying to ratelimit: ${e?.message}`)
      throw new AuthenticationError(
        `Error when trying to ratelimit: ${e?.message}`
      )
    }
  }
}
