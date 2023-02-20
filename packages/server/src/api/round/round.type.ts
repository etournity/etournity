import { objectType } from 'nexus'
import { MatchStatus } from '@prisma/client'
import { Round } from 'nexus-prisma'

export const RoundType = objectType({
  name: 'Round',
  definition(t) {
    t.field(Round.id)
    t.field(Round.title)
    t.field(Round.format)
    t.field(Round.matches)
    t.field(Round.stage)
    t.field(Round.stageId)
    t.field(Round.status)
    t.field(Round.number)
    t.field(Round.locked)
    t.nonNull.int('completedMatches', {
      resolve: async (round, __, { prisma }) =>
        prisma.match.count({
          where: {
            round: { id: round.id },
            status: { in: [MatchStatus.DONE, MatchStatus.NO_SHOW] },
          },
        }),
    })
    t.int('playersInRound', {
      resolve: async (round, _, { prisma }) =>
        prisma.participant.count({
          where: { team: { matches: { some: { roundId: round.id } } } },
        }),
    })
  },
})
