import { arg, idArg, list, nonNull, subscriptionField } from 'nexus'
import { ChatRoom } from 'nexus-prisma'
import { withFilter } from 'graphql-subscriptions'

export const ChatRoomSubscriptions = subscriptionField('chatRoomChanged', {
  type: ChatRoom.$name,

  args: {
    chatRoomId: nonNull(idArg()),
    actions: list(nonNull(arg({ type: 'String' }))),
  },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([ChatRoom.$name]),
    (payload, variables, { user }) =>
      payload.namespaceId === variables.chatRoomId &&
      (payload.updateAll || user.id !== payload.userId) &&
      (variables?.actions?.some(
        (action: string) => action === payload.action
      ) ??
        true)
  ),
  resolve: (payload) => payload?.extra ?? null,
})
