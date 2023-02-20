import express, { RequestHandler, Request } from 'express'
import passport, { Passport } from 'passport'

import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as AnonymousStrategy } from 'passport-anonymous'
import { Strategy as DiscordStrategy } from 'passport-discord'

import ms from 'ms'
import jwt from 'jsonwebtoken'
import { PrismaClient, User, UserAccount } from '@prisma/client'
import { Except } from 'type-fest'
import { mixpanel } from './globals'
interface OAuthResponse {
  id: string
  username: string
  avatar: string
  discriminator: string
  email: string
  verified: boolean
  locale: string
  mfa_enabled: boolean
  provider: string
  fetchedAt: string
  accessToken: string
  refreshToken: string
}

const jwtExtractor = (req: Request): string | null => {
  if (req?.headers?.authorization)
    return req.headers.authorization.replace('Bearer ', '')
  if (req?.cookies?.[`jwt_${process.env.ETY_ENV ?? 'local'}`])
    return req.cookies[`jwt_${process.env.ETY_ENV ?? 'local'}`]
  return null
}

export default class AuthProvider {
  prisma: PrismaClient
  passport: passport.Authenticator

  jwtOptions = {
    jwtFromRequest: jwtExtractor,
    expiresIn: process.env.JWT_EXPIRES,
    secretOrKey: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  }

  constructor({ prisma, jwt }: { prisma: PrismaClient; jwt?: string }) {
    this.prisma = prisma
    if (jwt) this.jwtOptions.jwtFromRequest = () => jwt

    const passport = new Passport()
    passport.use(
      new JwtStrategy(this.jwtOptions, async (jwtPayload, done) =>
        done(null, await this.getUser({ userID: jwtPayload.sub }))
      )
    )

    passport.use(
      new DiscordStrategy(
        {
          clientID: process.env.DISCORD_CLIENT_ID ?? '',
          clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
          callbackURL: process.env.DISCORD_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, cb) =>
          cb(null, { ...profile, accessToken, refreshToken })
      )
    )

    passport.use(new AnonymousStrategy())
    this.passport = passport
  }

  globalMiddleware(): RequestHandler {
    return this.passport.initialize()
  }

  authenticate(): RequestHandler {
    return this.passport.authenticate(['jwt', 'anonymous'], { session: false })
  }

  oauthRoutes(): RequestHandler {
    // eslint-disable-next-line new-cap
    const router = express.Router()

    router.get('/discord', (req, res) => {
      req.session.returnTo = req.query.returnTo?.toString()
      res.redirect('/auth/discord/forward')
    })

    router.get(
      '/discord/forward',
      this.passport.authenticate('discord', {
        session: true,
        scope: ['identify', 'email'],
      })
    )

    router.get(
      '/discord/callback',
      this.passport.authenticate('discord', {
        session: false,
        failureRedirect: process.env.CLIENT_URL,
      }),
      this.generateToken.bind(this)
    )

    router.get('/logout', (req, res) => {
      res.clearCookie(`jwt_${process.env.ETY_ENV ?? 'local'}`, {
        domain: process.env.JWT_COOKIE_DOMAIN as string,
        sameSite: 'strict',
        httpOnly: false,
      })
      req.logOut()
      res.redirect(process.env.CLIENT_URL as string)
    })

    return router
  }

  async getUser({ userID }: { userID: string }): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userID } })
  }

  async findOrCreateUser(
    acc: Except<UserAccount, 'id' | 'ownerId'>
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        linkedAccounts: {
          some: {
            provider: acc.provider,
            userId: acc.userId,
          },
        },
      },
    })
    if (user) return user

    return this.prisma.user
      .create({
        data: {
          displayName: acc.username,
          linkedAccounts: {
            create: acc,
          },
          roles: ['user', 'organizer'],
        },
      })
      .then((user) => {
        mixpanel.track('User Registration', { distinct_id: user.id })
        mixpanel.people.set(user.id, {
          $name: acc.username,
          $discriminator: acc.discriminator,
          $created: Date.now(),
          $email: acc.email,
          $avatar: acc.avatar,
        })
        return user
      })
  }

  parseAvatar = (userId: string, avatarHash?: string) => {
    if (!avatarHash) return null

    // Discord adds "a_" to the hash if the img is a gif
    const imgFormat = avatarHash.split('_').length > 1 ? 'gif' : 'png'

    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${imgFormat}`
  }

  async generateToken(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const oAuthUser = req.user as OAuthResponse
    const user = await this.findOrCreateUser({
      userId: oAuthUser.id,
      mfaEnabled: oAuthUser.mfa_enabled,
      username: oAuthUser.username,
      avatar: this.parseAvatar(oAuthUser.id, oAuthUser.avatar),
      discriminator: oAuthUser.discriminator,
      email: oAuthUser.email,
      verified: oAuthUser.verified,
      locale: oAuthUser.locale,
      provider: oAuthUser.provider,
      fetchedAt: oAuthUser.fetchedAt,
      accessToken: oAuthUser.accessToken,
      refreshToken: oAuthUser.refreshToken,
    })

    if (user) {
      const token = jwt.sign({}, process.env.JWT_SECRET as string, {
        expiresIn: this.jwtOptions.expiresIn,
        audience: this.jwtOptions.audience,
        issuer: this.jwtOptions.issuer,
        subject: user.id,
        algorithm: 'HS512',
      })

      res.cookie(`jwt_${process.env.ETY_ENV ?? 'local'}`, token, {
        domain: process.env.JWT_COOKIE_DOMAIN as string,
        maxAge: ms(this.jwtOptions.expiresIn as string),
        sameSite: 'strict',
        httpOnly: false,
        secure: process.env.ETY_ENV !== 'local',
      })
    }

    res.redirect(req.session.returnTo ?? (process.env.CLIENT_URL as string))
  }
}
