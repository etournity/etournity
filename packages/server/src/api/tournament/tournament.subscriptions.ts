import { arg, idArg, list, nonNull, subscriptionField } from 'nexus'
import { withFilter } from 'graphql-subscriptions'
import { Tournament } from 'nexus-prisma'

export const TournamentSubscriptions = subscriptionField('tournamentChanged', {
  type: 'Tournament',

  args: {
    tournamentId: nonNull(idArg()),
    actions: list(arg({ type: 'String' })),
  },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([Tournament.$name]),
    (payload, variables, { user }) =>
      payload.namespaceId === variables.tournamentId &&
      (payload.updateAll || user.id !== payload.userId) &&
      (variables?.actions?.some(
        (action: string) => action === payload.action
      ) ??
        true)
  ),
  resolve: (payload) => payload?.extra ?? null,
})
