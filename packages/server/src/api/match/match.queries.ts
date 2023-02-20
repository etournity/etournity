import { extendType, idArg, nonNull } from 'nexus'
import { Match } from 'nexus-prisma'

export const MatchQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('match', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (_, { matchId }, { prisma }) =>
        prisma.match.findUnique({
          where: { id: matchId },
        }),
    })
    t.nonNull.list.nonNull.field('matchesInTournament', {
      type: Match.$name,
      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.match.findMany({
          where: {
            round: {
              stage: {
                tournamentId,
              },
            },
          },
        }),
    })
  },
})
