import { objectType } from 'nexus'
import { Match, MatchGame } from 'nexus-prisma'
export const MatchType = objectType({
  name: Match.$name,
  definition(t) {
    t.field(Match.id)
    t.field(Match.opponents)
    t.field(Match.status)
    t.field(Match.inGame)
    t.field(Match.readyChecks)
    t.field(Match.gameLobbyCode)
    t.field(Match.round)
    t.field(Match.noShowTimer)
    t.field(Match.number)
    t.field(Match.tickets)
    t.nonNull.list.nonNull.field(Match.matchGames.name, {
      type: MatchGame.$name,
      resolve: async (match, __, { prisma }) =>
        prisma.matchGame.findMany({
          where: { matchId: match.id },
          orderBy: {
            number: 'asc',
          },
        }),
    })

    t.field('supportLink', {
      type: 'String',

      resolve: async (match, _, { prisma }) =>
        (
          await prisma.tournament.findFirst({
            where: {
              stages: {
                some: {
                  rounds: { some: { matches: { some: { id: match.id } } } },
                },
              },
            },
          })
        )?.supportLink ?? null,
    })
  },
})
