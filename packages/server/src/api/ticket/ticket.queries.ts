import { extendType, idArg, nonNull } from 'nexus'
import { Ticket } from 'nexus-prisma'
import { ParticipantRoleType } from '.prisma/client'

export const TicketQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('tickets', {
      type: Ticket.$name,
      resolve: async (_, __, { prisma }) => prisma.ticket.findMany(),
    })
    t.nonNull.list.nonNull.field('tournamentTickets', {
      type: Ticket.$name,
      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.ticket.findMany({ where: { tournamentId } }),
    })
    t.list.nonNull.field('relatedTickets', {
      type: Ticket.$name,

      resolve: async (_, __, { prisma, user }) => {
        if (!user) return []

        return prisma.ticket.findMany({
          where: {
            OR: [
              { assigneeId: user.id },
              { reporterId: user.id },
              { reportedId: user.id },
              {
                tournament: {
                  participants: {
                    some: {
                      userId: user.id,
                      roles: {
                        some: {
                          type: {
                            in: [
                              ParticipantRoleType.ADMIN,
                              ParticipantRoleType.HOST,
                              ParticipantRoleType.MODERATOR,
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          include: { assignee: true, reporter: true, reported: true },
        })
      },
    })
  },
})
