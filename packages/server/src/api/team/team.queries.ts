import { extendType, idArg, nonNull } from 'nexus'

export const TeamQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('team', {
      type: 'Team',

      args: {
        teamId: nonNull(idArg()),
      },
      resolve: async (_, { teamId }, { prisma }) =>
        prisma.team.findUnique({
          where: { id: teamId },
        }),
    })
  },
})
