import { booleanArg, extendType, nonNull, stringArg } from 'nexus'
import { User } from 'nexus-prisma'

export const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('setUsername', {
      type: User.$name,
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }, { prisma, user }) =>
        prisma.user.update({
          where: { id: user.id },
          data: {
            displayName: name,
          },
        }),
    })
    t.field('setHideDisclaimer', {
      type: User.$name,
      args: { hideDisclaimer: nonNull(booleanArg()) },
      resolve: async (_, { hideDisclaimer }, { prisma, user }) =>
        prisma.user.update({
          where: { id: user.id },
          data: { hideAlphaDisclaimer: hideDisclaimer },
        }),
    })
  },
})
