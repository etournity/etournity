import { extendType, idArg } from 'nexus'

export const StageQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('tournamentStages', {
      type: 'Stage',
      args: { tournamentId: idArg({ required: true }) },
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.stage.findMany({
          where: { tournamentId },
        }),
    })
  },
})
