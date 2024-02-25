import { arg, extendType, idArg, nonNull } from 'nexus'
import { MatchGame, PrismaClient, Prisma } from '@prisma/client'
import { PubSubHandler } from '../../helpers/pubSubHelper'
import { Match, MatchGame as MatchGameType } from 'nexus-prisma'
import { setMatchGameStatus } from '../../helpers/setMatchGameStatus'

export const MatchGameMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createMatchGame', {
      type: MatchGameType.$name,
      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (_, { matchId }, { prisma, pubsub }) =>
        createMatchGame({ prisma, matchId, pubsub }),
    })
    t.field('setMatchGameStatus', {
      type: MatchGameType.$name,
      args: {
        matchGameId: nonNull(idArg()),
        status: arg({ type: 'GameStatus' }),
      },

      resolve: async (_, { matchGameId, status }, { prisma, pubsub }) =>
        setMatchGameStatus(matchGameId, status ?? null, prisma, pubsub),
    })
  },
})

export const createMatchGame = async ({
  prisma,
  matchId,
  pubsub,
}: {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
  matchId: string
  pubsub: PubSubHandler
}): Promise<MatchGame | null> => {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { matchGames: true, round: true },
  })
  if (!match) return null
  // Don't add more matchGames if there are already enough
  if (match.matchGames.length < (match.round?.format || 1)) {
    await prisma.matchGame
      .create({
        data: {
          match: { connect: { id: matchId } },
          number: match.matchGames.length + 1,
          status: 'WAITING',
        },
        include: { match: true },
      })
      .then(async (matchGame) => {
        await pubsub.publish(
          Match.$name,
          matchGame.match?.id,
          'createMatchGame',
          { ...match, matchGames: [...match.matchGames, matchGame] }
        )

        return matchGame
      })
  }

  return null
}
