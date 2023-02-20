import { extendType } from 'nexus'

export const RegionQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('regions', {
      args: {},
      type: 'Region',
      resolve: async (_, args, { prisma }) =>
        prisma.region.findMany({ orderBy: { name: 'asc' } }),
    })
  },
})
