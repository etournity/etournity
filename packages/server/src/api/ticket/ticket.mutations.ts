import { arg, booleanArg, extendType, idArg, nonNull, stringArg } from 'nexus'
import { Ticket } from 'nexus-prisma'
import { closeTicket } from '../../helpers/closeTicket'
import { kickParticipant } from '../../helpers/kickParticipant'
import { createTicket } from '../../helpers/createTicket'

export const TicketMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createTicket', {
      type: Ticket.$name,
      args: {
        tournamentId: idArg(),
        ticketType: nonNull(arg({ type: 'TicketType' })),
        reporterId: nonNull(idArg()),
        reportedId: idArg(),
        matchBlocked: booleanArg(),
        message: stringArg(),
      },
      resolve: async (_, args, { prisma, pubsub }) =>
        createTicket(args, prisma, pubsub),
    })
    t.nonNull.field('createSystemTicket', {
      type: Ticket.$name,
      args: {
        tournamentId: idArg(),
        matchId: idArg(),
        ticketType: nonNull(arg({ type: 'TicketType' })),
        reportedId: idArg(),
        matchBlocked: booleanArg(),
        message: stringArg(),
      },
      resolve: async (_, args, { prisma, pubsub }) =>
        createTicket(args, prisma, pubsub),
    })
    t.nonNull.field('setTicketAssignee', {
      type: Ticket.$name,
      args: {
        ticketId: nonNull(idArg()),
        assigneeId: nonNull(idArg()),
      },
      resolve: async (_, { ticketId, assigneeId }, { prisma, pubsub }) => {
        const ticket = await prisma.ticket.update({
          where: { id: ticketId },
          data: { assignee: { connect: { id: assigneeId } } },
          include: { tournament: true },
        })
        await pubsub.publish(
          Ticket.$name,
          ticket?.id,
          'setTicketAssignee',
          ticket
        )
        return ticket
      },
    })
    t.field('closeTicket', {
      type: Ticket.$name,

      args: {
        ticketId: nonNull(idArg()),
        verdict: stringArg({}),
      },
      resolve: async (_, { ticketId, verdict }, ctx) =>
        closeTicket(ctx, ticketId, verdict),
    })
    t.field('resolvePlayerReport', {
      type: Ticket.$name,

      args: {
        ticketId: nonNull(idArg()),
        participantId: nonNull(idArg()),
        verdict: stringArg({}),
      },
      resolve: async (
        _,
        { ticketId, verdict, participantId },
        { prisma, pubsub, user }
      ) => {
        await kickParticipant({ prisma, pubsub, user }, participantId)
        return closeTicket({ prisma, pubsub, user }, ticketId, verdict)
      },
    })
    t.field('deleteTicket', {
      type: Ticket.$name,
      args: { ticketId: nonNull(idArg()) },
      resolve: async (_, { ticketId }, { prisma, pubsub }) => {
        const ticket = await prisma.ticket.delete({
          where: { id: ticketId },
          include: { tournament: true },
        })
        await pubsub.publish(Ticket.$name, ticket?.id, 'deleteTicket', ticket)
        return ticket
      },
    })
  },
})
