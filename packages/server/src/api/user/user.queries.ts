import { extendType, idArg, nonNull } from 'nexus'
import { User } from 'nexus-prisma'

export const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('users', {
      type: User.$name,

      resolve: async (_, __, { prisma }) =>
        prisma.user.findMany({ orderBy: { displayName: 'asc' } }),
    })
    t.field('user', {
      type: User.$name,

      args: {
        userId: nonNull(idArg()),
      },
      resolve: async (_, { userId }, { prisma }) =>
        prisma.user.findUnique({ where: { id: userId } }),
    })
    t.field('me', {
      type: User.$name,

      resolve: async (_, __, { prisma, user }) =>
        prisma.user.findUnique({
          where: { id: user.id },
        }),
    })
  },
})
