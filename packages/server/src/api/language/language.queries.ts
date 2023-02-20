import { extendType } from 'nexus'

export const LanguageQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('languages', {
      type: 'Language',
      resolve: async (_, __, { prisma }) => prisma.language.findMany(),
    })
  },
})
