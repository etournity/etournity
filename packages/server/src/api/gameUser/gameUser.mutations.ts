import {
  extendType,
  FieldResolver,
  stringArg,
  idArg,
  intArg,
  nonNull,
} from 'nexus'
import { GameUser, Tournament } from 'nexus-prisma'

export const GameUserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createOrUpdateGameUser', {
      type: GameUser.$name,

      args: {
        gameId: nonNull(idArg()),
        userId: nonNull(idArg()),
        inGameName: nonNull(stringArg()),
        elo: nonNull(intArg()),
      },
      resolve: createOrUpdateGameUserResolver,
    })
    t.field('updateElo', {
      type: GameUser.$name,

      args: {
        id: nonNull(idArg()),
        elo: nonNull(intArg()),
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { id, elo, tournamentId }, { prisma, pubsub }) => {
        const gameUser = await prisma.gameUser.update({
          where: { id },
          data: { elo },
        })
        const tournament = await prisma.tournament.findUnique({
          where: { id: tournamentId },
        })
        await pubsub.publish(Tournament.$name, tournament?.id, 'updateElo')

        return gameUser
      },
    })
  },
})

const createOrUpdateGameUserResolver: FieldResolver<
  'Mutation',
  'createOrUpdateGameUser'
> = async (_, { gameId, inGameName, elo, userId }, { prisma, user }) => {
  const gameUser = {
    inGameName,
    elo,
    game: {
      connect: {
        id: gameId,
      },
    },
    user: {
      connect: {
        id: userId,
      },
    },
  }

  return prisma.gameUser.upsert({
    where: {
      GameUser_userId_gameId_key: {
        gameId,
        userId,
      },
    },
    create: gameUser,
    update: gameUser,
  })
}
