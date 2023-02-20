import { extendType } from 'nexus'

export const GameUserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('gameUsers', {
      args: {},
      type: 'GameUser',
      resolve: async (_, args, { prisma }) =>
        prisma.gameUser.findMany({
          orderBy: { inGameName: 'asc' },
        }),
    })
  },
})
