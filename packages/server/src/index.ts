import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import dotenv from 'dotenv'

import express from 'express'
import cookieParser from 'cookie-parser'
import http, { createServer } from 'http'

import { ApolloServer } from 'apollo-server-express'

import { apolloComplexityPlugin } from './plugins/complexity'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'

import { schema } from './schema'
import AuthProvider from './auth'
import { seed } from './seed/seed'
import { globalRateLimiterMiddleware } from './ratelimit'
import * as Sentry from '@sentry/node'
import { Logger } from './logger'
import session from 'express-session'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import { verify } from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-errors'
import { prisma, pubsub, REDIS_URL } from './globals'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import * as Tracing from '@sentry/tracing'
import { extractJWT } from './helpers/cookies'
import {
  closeStaleProcessor,
  closeStaleQueue,
} from './queues/staleTournaments.queue'

const logger = new Logger()

dotenv.config({ path: '.env' })

if (!process.env.DATABASE_URL) throw new Error('database url has to be set')
if (!process.env.ETY_ENV) throw new Error('ETY_ENV has to be set')

const PORT = process.env.PORT ?? 5000
const ENV = process.env.ETY_ENV

logger.info(`connecting to the database at ${process.env.DATABASE_URL}`)

const auth = new AuthProvider({
  prisma,
})

prisma.$on('error', (e) => {
  logger.error(e, 'prisma')
})

prisma.$on('warn', (e) => {
  logger.warn(e, 'prisma')
})

prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  // Exclude the seeding mutations
  if (params.model !== 'Language' && params.model !== 'Region') {
    logger.verbose(
      `${params.model}.${params.action} took ${after - before}ms`,
      'prisma'
    )
  }

  return result
})

seed(prisma, ENV === 'local').catch((e) =>
  logger.error(`error while seeding the database: ${e}`)
)

if (
  (process.env?.JWT_SECRET?.length || 0) < 15 &&
  process.env.ETY_ENV !== 'local'
) {
  throw new Error("can't use insecure JWT_SECRET outside of local")
}

const apolloLogger = (): ApolloServerPlugin => ({
  serverWillStart: async () => {
    logger.info('Apollo Server starting', 'apollo')
  },
  requestDidStart: async () => ({
    willSendResponse: async (r) => {
      logger.debug(`${r.operationName} executed`, 'apollo')
    },
    didEncounterErrors: async (e) => {
      e.errors.forEach((e) =>
        logger.error(`${e.originalError} \n Stack: ${e.stack}`, 'apollo')
      )
    },
  }),
})

declare module 'express-session' {
  interface SessionData {
    returnTo: string
  }
}

const getDynamicContext = async (req: any, isWSS: boolean) => {
  const jwt = extractJWT(req?.headers?.cookie)

  if (jwt && process.env.JWT_SECRET) {
    try {
      const decoded = verify(jwt, process.env.JWT_SECRET)
      const user = await auth.getUser({
        userID: decoded.sub?.toString() ?? '',
      })

      pubsub.userId = user?.id ?? null

      return {
        prisma,
        user,
        pubsub,
      }
    } catch (e: unknown) {
      logger.error('Invalid JWT token in websocket payload!', 'subscriptions')
      throw new AuthenticationError('Invalid JWT token in websocket payload!')
    }
  }

  if (!isWSS) return { prisma, undefined, pubsub }

  logger.error('Missing websocket auth token!', 'subscriptions')
  return {
    prisma,
    user: null,
    pubsub,
  }
}

async function startServer() {
  const app = express()

  const httpServer = createServer(app)

  const wss = new WebSocketServer({
    path: '/graphql',
    server: httpServer,
  })

  const SENTRY_DSN =
    process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

  Sentry.init({
    dsn:
      SENTRY_DSN ??
      'https://76042cbb4a26424eaa3fcc3c11a1042b@o989987.ingest.sentry.io/5946990',
    tracesSampleRate: 1.0,
    environment: process.env.ETY_ENV,
    enabled: process.env.ETY_ENV !== 'local',
    debug: process.env.ETY_ENV === 'local',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wssCleanup = useServer(
    {
      schema,
      context: (context) => getDynamicContext(context.extra.request, true),
    },
    wss
  )

  const server = new ApolloServer({
    schema,
    debug: process.env.ETY_ENV === 'local',

    // Don't provide a full stacktrace to the client
    formatError: (err) =>
      ['local', 'develop'].includes(process.env.ETY_ENV ?? '')
        ? err
        : { ...err, stack: undefined },
    introspection: true,
    context: (context) => getDynamicContext(context.req, false),
    plugins: [
      apolloComplexityPlugin(schema),
      apolloLogger,
      {
        serverWillStart: async () => ({
          drainServer: async () => {
            await wssCleanup.dispose()
          },
        }),
      },
      // eslint-disable-next-line new-cap
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  })

  app.disable('x-powered-by')

  app.use(express.json({ limit: '6mb' }))
  app.use(cookieParser())
  const redisClient = new Redis(REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 50, 2000),
  })
  const RedisStore = connectRedis(session)

  if (!process.env.SESSION_SECRET)
    throw new Error('SESSION_SECRET has to be set')
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: { secure: process.env.ETY_ENV !== 'local' },
      saveUninitialized: true,
      store: new RedisStore({ client: redisClient as any }),
    })
  )

  app.use(auth.globalMiddleware())
  app.use(auth.authenticate())
  app.use(globalRateLimiterMiddleware)

  // Set-up check for stale tournaments to run every monday at 04:00 AM
  void closeStaleQueue.process('closeStaleTournaments', closeStaleProcessor)
  closeStaleQueue
    .add('closeStaleTournaments', {}, { repeat: { cron: '0 4 * * 1' } })
    .then(() => {
      logger.info('Added closeStaleTournaments to bull queue', 'server')
    })
    .catch((e) => {
      logger.error(e, 'server')
    })

  app.post('/sentry', (req) => {
    const options: http.RequestOptions = {
      method: 'POST',
      hostname: req.hostname,
      path: req.originalUrl,
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
      },
    }

    const request = http.request(options)
    request.write(req.body)
  })

  app.use('/auth', auth.oauthRoutes())
  app.use(auth.authenticate(), (_, res) => {
    res.status(404).send(`<pre>  These three are certain:
Death, taxes, and site not found.
You, victim of one.</pre>`)
  })

  redisClient.on('error', function (err) {
    logger.error('Could not establish a connection with redis. ' + err, 'redis')
  })

  redisClient.on('connect', function () {
    logger.info('Connected to redis successfully', 'redis')
  })

  httpServer.listen({ port: PORT }, () => {
    logger.info(`🔌 Subscriptions ready at port ${PORT}`)
    logger.info(`🚀 Server ready at port ${PORT}`)
  })
}

startServer().catch((e) => {
  logger.error(e, 'server')
})
