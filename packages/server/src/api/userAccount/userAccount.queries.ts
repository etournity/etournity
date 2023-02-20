import { extendType } from 'nexus'

export const UserAccountQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('userAccounts', {
      type: 'UserAccount',

      resolve: async (_, __, { prisma }) => prisma.userAccount.findMany({}),
    })
  },
})
