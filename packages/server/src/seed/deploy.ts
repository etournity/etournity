import { PrismaClient } from '@prisma/client'
import { Logger } from '../logger'
import languages from './languages'
import regions from './regions'
import games from './games'
import platforms from './platforms'
import gameModes from './gameModes'

const logger = new Logger(['seed', 'deploy'])

export const seedDeploy = async (prisma: PrismaClient) => {
  async function main() {
    const languageCount = await prisma.platform.count()
    const regionCount = await prisma.region.count()
    const gameCount = await prisma.game.count()
    const platformCount = await prisma.platform.count()
    const gameModeCount = await prisma.gameMode.count()
    const userCount = await prisma.user.count()

    const counts = [
      languageCount,
      regionCount,
      gameCount,
      platformCount,
      gameModeCount,
      userCount,
    ]

    if (counts.every((count) => count !== 0))
      return logger.info('Skipped seeding because database is already seeded')

    logger.info('Now seeding deploy data...')

    if (userCount === 0) {
      const defaultUserAccount = {
        accessToken: '',
        fetchedAt: '',
        locale: 'de_DE',
        mfaEnabled: false,
        refreshToken: '',
        verified: true,
        email: 'mail@etournity.com',
        avatar: 'https://i.imgur.com/BTNIDBR.gif',
      }
      const user = {
        id: 'c000000000000000000system',
        roles: ['user', 'admin', 'organizer'],
        inGameName: 'system',
        discriminator: '1111',
        provider: 'custom',
        hideDisclaimer: true,
        name: 'system',
      }

      await prisma.user.upsert({
        where: {
          id: user.id,
        },
        create: {
          displayName: user.name,
          createdAt: new Date(),
          id: user.id,
          linkedAccounts: {
            create: {
              userId: user.id,
              username: user.name,
              discriminator: user.discriminator,
              provider: user.provider,
              ...defaultUserAccount,
            },
          },
          roles: { set: user.roles },
          hideAlphaDisclaimer: user.hideDisclaimer,
        },
        update: {},
      })

      logger.info('Seeding system user done')
    }

    if (languageCount === 0) {
      for (const [, value] of Object.entries(languages)) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.language.upsert({
          where: {
            code: value['alpha3-b'],
          },
          create: {
            name: value.English.toString(),
            code: value['alpha3-b'],
          },
          update: {},
        })
      }

      logger.info('Seeding languages done')
    }

    if (regionCount === 0) {
      for (const [, value] of Object.entries(regions)) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.region.create({
          data: { ...value },
        })
      }

      logger.info('Seeding regions done')
    }

    if (gameCount === 0) {
      for (const [, value] of Object.entries(games)) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.game.create({
          data: { ...value },
        })
      }

      logger.info('Seeding games done')
    }

    if (gameModeCount === 0) {
      for (const [, value] of Object.entries(gameModes)) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.gameMode.create({
          data: { ...value },
        })
      }

      logger.info('Seeding gameMode done')
    }

    if (platformCount === 0) {
      for (const [, value] of Object.entries(platforms)) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.platform.create({
          data: { ...value },
        })
      }

      logger.info('Seeding platforms done')
    }
  }

  return main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
