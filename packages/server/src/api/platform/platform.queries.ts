import { extendType } from 'nexus'

export const PlatformQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('platforms', {
      type: 'Platform',
      resolve: async (_, args, { prisma }) =>
        prisma.platform.findMany({ orderBy: { name: 'asc' } }),
    })
  },
})
