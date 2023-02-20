import dayjs from 'dayjs'
import { ParticipantRoleType, PrismaClient } from '@prisma/client'

import { Logger } from '../logger'
const logger = new Logger(['seed', 'dev'])

const tournamentID = 'c00000000000000tournament'
const stageID = 'c000000000000000000stage'

const teams = {
  team1: 'c000000000000000000team1',
  team2: 'c000000000000000000team2',
}

const users = {
  admin: {
    id: 'c0000000000000000000admin',
    roles: ['user', 'admin'],
    inGameName: 'Admin',
    discriminator: '1111',
    provider: 'custom',
    hideDisclaimer: true,
  },
  organizer: {
    id: 'c000000000000000organizer',
    roles: ['user', 'organizer'],
    inGameName: 'Organizer',
    discriminator: '2222',
    provider: 'custom',
    hideDisclaimer: true,
  },
  player1: {
    id: 'c00000000000000000player1',
    roles: ['user'],
    inGameName: 'Player1',
    discriminator: '3333',
    provider: 'custom',
    hideDisclaimer: false,
  },
  player2: {
    id: 'c00000000000000000player2',
    roles: ['user', 'organizer'],
    inGameName: 'Player2',
    discriminator: '4444',
    provider: 'custom',
    hideDisclaimer: true,
  },
  RedMap: {
    id: '137887927781818368',
    roles: ['user', 'organizer'],
    inGameName: 'RedMap',
    discriminator: '0001',
    provider: 'discord',
    hideDisclaimer: true,
  },
  ParanormalRaccoon: {
    id: '435783827323879424',
    roles: ['user', 'organizer'],
    inGameName: 'ParanormalRaccoon',
    discriminator: '0890',
    provider: 'discord',
    hideDisclaimer: true,
  },
  'Fred die Flunder': {
    id: '287310917836865536',
    roles: ['user', 'organizer'],
    inGameName: 'GeneralFlunder',
    discriminator: '1701',
    provider: 'discord',
    hideDisclaimer: true,
  },
  VitaVictus: {
    id: '107821700023881728',
    roles: ['user', 'organizer'],
    inGameName: 'VitaVictus',
    discriminator: '1001',
    provider: 'discord',
    hideDisclaimer: true,
  },
  Luca: {
    id: '489810460221243393',
    roles: ['user', 'organizer'],
    inGameName: 'Klebefinger',
    discriminator: '7031',
    provider: 'discord',
    hideDisclaimer: true,
  },
}

const participants = {
  organizer: 'c000000000000000participantO',
  participant1: 'c000000000000000participant1',
  participant2: 'c000000000000000participant2',
}

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

export const seedDev = async (prisma: PrismaClient) => {
  logger.info('Now seeding dev data...')
  try {
    let elo = 1200 // Brawlhalla starting elo

    const gameID = (
      await prisma.game.findFirst({
        where: { title: 'Brawlhalla' },
      })
    )?.id
    if (!gameID) throw Error("Can't find Game `Brawlhalla`!")

    const gameModeID = (
      await prisma.gameMode.findFirst({
        where: { name: '1v1' },
      })
    )?.id
    if (!gameID) throw Error("Can't find GameMode `1v1`!")

    const region = await prisma.region.findUnique({ where: { code: 'eu' } })
    if (!region) throw Error("Can't find Region `Europe`!")

    for (const [name, user] of Object.entries(users)) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.user.upsert({
        where: {
          id: user.id,
        },
        create: {
          displayName: name,
          createdAt: new Date(),
          id: user.id,
          linkedAccounts: {
            create: {
              userId: user.id,
              username: name,
              discriminator: user.discriminator,
              provider: user.provider,
              ...defaultUserAccount,
            },
          },
          gameUsers: {
            create: {
              inGameName: user.inGameName,
              elo: elo++,
              game: {
                connect: { id: gameID },
              },
            },
          },
          roles: { set: user.roles },
          hideAlphaDisclaimer: user.hideDisclaimer,
        },
        update: {},
      })
    }

    await prisma.tournament.upsert({
      where: { id: tournamentID },
      create: {
        id: tournamentID,
        description: 'Brawlhalla Tournament',
        checkinEnd: dayjs().add(3, 'minutes').toDate(),
        checkinStart: dayjs().add(1, 'minute').toDate(),
        date: dayjs().add(10, 'minutes').toDate(),
        createdAt: new Date(),
        publishedAt: new Date(),
        discordLink: '',
        status: 'PUBLISHED',
        supportLink: 'https://discord.gg/ysm29w7Yxn',
        platforms: {
          connect: { code: 'pc' },
        },
        region: {
          connect: { code: region.code },
        },
        language: {
          connect: { code: 'eng' },
        },
        streamLink: 'https://twitch.tv/etournity',
        rules: 'be nice to each other',
        title: 'Brawlhalla Tournament',
        maxPlayers: 16,
        gameMode: {
          connect: {
            id: gameModeID,
          },
        },
        participants: {
          create: [
            {
              id: participants.organizer,
              roles: { create: { type: ParticipantRoleType.HOST } },
              user: { connect: { id: users.organizer.id } },
            },
            {
              id: participants.participant1,
              roles: { create: { type: ParticipantRoleType.PLAYER } },
              user: { connect: { id: users.player1.id } },
              registeredAt: dayjs().add(2, 'minutes').toDate(),
            },
            {
              id: participants.participant2,
              roles: { create: { type: ParticipantRoleType.PLAYER } },
              user: { connect: { id: users.player2.id } },
              registeredAt: dayjs().add(2, 'minutes').toDate(),
              requestingMod: true,
            },
          ],
        },
        game: {
          connect: {
            id: gameID,
          },
        },
        stages: {
          create: [
            {
              id: stageID,
              title: 'First Stage',
              type: 'SINGLE',
              mode: 1,
            },
          ],
        },
        chatRoom: {
          create: {
            name: 'General Chat',
            members: {
              connect: [
                { id: users.organizer.id },
                { id: users.player1.id },
                { id: users.player2.id },
              ],
            },
          },
        },
      },

      update: {},
    })

    await prisma.team.upsert({
      where: {
        id: teams.team1,
      },
      create: {
        id: teams.team1,
        tournament: { connect: { id: tournamentID } },
        name: 'Team 1',
        seed: 1,
        participants: {
          connect: {
            id: participants.participant1,
          },
        },
        leader: {
          connect: {
            id: participants.participant1,
          },
        },
      },
      update: {},
    })

    await prisma.team.upsert({
      where: {
        id: teams.team2,
      },
      create: {
        id: teams.team2,
        tournament: { connect: { id: tournamentID } },
        seed: 2,
        name: 'Team 2',
        participants: {
          connect: {
            id: participants.participant2,
          },
        },
        leader: {
          connect: {
            id: participants.participant2,
          },
        },
      },
      update: {},
    })

    await prisma.$transaction(
      Array(16 - 2)
        .fill(null)
        .flatMap((_, i) => {
          // Creating a random 16 digit number as id
          // Source: https://www.cluemediator.com/generate-an-n-digit-random-number-using-javascript
          const id = Math.random().toFixed(16).split('.')[1]
          return [
            prisma.participant.upsert({
              where: { id: `participant${i + 3}` },
              create: {
                id: `participant${i + 3}`,
                roles: { create: { type: ParticipantRoleType.PLAYER } },
                tournament: {
                  connect: { id: tournamentID },
                },
                user: {
                  create: {
                    id,
                    displayName: `User ${i + 3}`,
                    gameUsers: {
                      create: {
                        game: {
                          connect: { id: gameID },
                        },
                        inGameName: `GameUser ${i + 3}`,
                        elo: 2000 + i,
                      },
                    },
                    linkedAccounts: {
                      create: {
                        userId: id,
                        username: `User ${i + 3}`,
                        discriminator: `${1000 + i}`,
                        provider: 'custom',
                        ...defaultUserAccount,
                      },
                    },
                  },
                },
              },
              update: {},
            }),

            prisma.team.upsert({
              where: { id: `team${i + 3}` },
              create: {
                id: `team${i + 3}`,
                name: `Team ${i + 3}`,
                tournament: { connect: { id: tournamentID } },
                participants: {
                  connect: {
                    id: `participant${i + 3}`,
                  },
                },
                leader: { connect: { id: `participant${i + 3}` } },
              },
              update: {},
            }),
          ]
        })
    )

    logger.info('Seeding dev data done')
  } catch (e: unknown) {
    logger.error(`Error while seeding dev data: ${e}`)
  }
}
