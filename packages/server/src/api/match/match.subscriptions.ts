import { idArg, list, nonNull, stringArg, subscriptionField } from 'nexus'
import { Match } from 'nexus-prisma'
import { withFilter } from 'graphql-subscriptions'

export const MatchSubscriptions = subscriptionField('matchChanged', {
  type: 'Match',

  args: {
    matchId: nonNull(idArg()),
    actions: list(nonNull(stringArg())),
  },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([Match.$name]),
    (payload, variables, { user }) =>
      payload.namespaceId === variables.matchId &&
      (payload.updateAll || user.id !== payload.userId) &&
      (variables?.actions?.some(
        (action: string) => action === payload.action
      ) ??
        true)
  ),
  resolve: (payload) => payload?.extra ?? null,
})
