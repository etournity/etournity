import { extendType, nonNull, stringArg } from 'nexus'
import { Game } from 'nexus-prisma'

export const GameMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createGame', {
      type: nonNull(Game.$name),
      args: {
        title: nonNull(stringArg()),
        homepage: stringArg(),
      },
      resolve: async (_, { title, homepage }, { prisma }) =>
        prisma.game.create({
          data: { title, homepage },
        }),
    })
  },
})
