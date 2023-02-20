import { extendType, idArg } from 'nexus'

export const GameQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('games', {
      type: 'Game',
      resolve: async (_, __, { prisma }) =>
        prisma.game.findMany({ orderBy: { title: 'asc' } }),
    })
  },
})
