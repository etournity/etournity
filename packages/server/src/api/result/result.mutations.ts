import { extendType, inputObjectType } from 'nexus'

export const ResultCreateInput = inputObjectType({
  name: 'ResultCreateInput',
  definition(t) {
    t.nonNull.id('teamId')
    t.nonNull.int('score')
  },
})
export const ResultMutations = extendType({
  type: 'Mutation',
  definition(t) {},
})
