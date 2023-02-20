import { arg, idArg, list, subscriptionField } from 'nexus'
import { withFilter } from 'graphql-subscriptions'
import { PrismaClient, User } from '.prisma/client'
import { Ticket } from 'nexus-prisma'

export const TicketSubscriptions = subscriptionField('ticketChanged', {
  type: 'Ticket',

  args: {
    ticketId: idArg(),
    tournamentId: idArg(),
    actions: list(arg({ type: 'String' })),
  },
  subscribe: withFilter(
    (_, __, { pubsub }) => pubsub.asyncIterator([Ticket.$name]),
    async (
      payload,
      variables,
      { prisma, user }: { prisma: PrismaClient; user: User }
    ) => {
      if (variables.tournamentId) {
        const tournamentTickets = await prisma.ticket.findMany({
          where: {
            tournamentId: variables.tournamentId,
          },
        })

        return tournamentTickets
          .map(({ id }) => id)
          .includes(payload.namespaceId)
      }

      return (
        payload.namespaceId === variables.ticketId &&
        (payload.updateAll || user.id !== payload.userId) &&
        (variables?.actions?.some(
          (action: string) => action === payload.action
        ) ??
          true)
      )
    }
  ),
  resolve: (payload) => payload?.extra ?? null,
})
