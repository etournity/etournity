import {
  Ticket as TicketModel,
  TicketType,
  PrismaClient,
  Prisma,
  ParticipantRoleType,
} from '@prisma/client'
import { PubSubHandler } from './pubSubHelper'
import { userMatch } from './userMatch'
import { Ticket } from 'nexus-prisma'

export interface CreateTicketArgs {
  ticketType: TicketType
  tournamentId?: string | null
  matchId?: string | null
  reporterId?: string | null
  reportedId?: string | null
  matchBlocked?: boolean | null
  message?: string | null
}

export const createTicket = async (
  data: CreateTicketArgs,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
  pubsub: PubSubHandler
): Promise<TicketModel> => {
  const currentMatch = data.reporterId
    ? await userMatch({ userId: data.reporterId, prisma })
    : undefined

  const tournamentId =
    data.tournamentId ??
    (data.matchId &&
      (
        await prisma.tournament.findFirst({
          where: {
            stages: {
              some: {
                rounds: { some: { matches: { some: { id: data.matchId } } } },
              },
            },
          },
        })
      )?.id)

  const tournamentStaff = await prisma.participant.findMany({
    where: {
      tournamentId,
      roles: {
        some: {
          type: {
            in: [ParticipantRoleType.HOST, ParticipantRoleType.MODERATOR],
          },
        },
      },
    },
    select: { userId: true },
  })

  const ticketsInTournament = await prisma.ticket.count({
    where: { tournamentId },
  })

  const ticket = await prisma.ticket.create({
    data: {
      type: data.ticketType,
      reporter: data.reporterId
        ? { connect: { id: data.reporterId } }
        : undefined,
      reported: data.reportedId
        ? { connect: { id: data.reportedId } }
        : undefined,
      matchBlocked: data.matchBlocked,
      number: tournamentId ? ticketsInTournament + 1 : undefined,
      message: data.message,
      tournament: tournamentId ? { connect: { id: tournamentId } } : undefined,
      assignee:
        tournamentStaff.length === 1
          ? { connect: { id: tournamentStaff[0].userId } }
          : undefined,
      match:
        data.matchId || currentMatch?.id
          ? { connect: { id: data.matchId ?? currentMatch?.id } }
          : undefined,
    },
    include: { tournament: true },
  })

  await pubsub.publish(
    Ticket.$name,
    ticket?.id,
    data.reporterId ? 'createTicket' : 'createSystemTicket',
    ticket
  )

  return ticket
}
