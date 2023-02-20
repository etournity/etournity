import { MatchStatus } from '@prisma/client'
import { Ticket } from 'nexus-prisma'
import { Context } from '../context'

export const closeMatchTickets = async (
  ctx: Context,
  matchId: string,
  verdict?: string | null
) => {
  const { prisma, pubsub, user } = ctx

  await prisma.ticket.updateMany({
    where: {
      resolved: false,
      match: {
        id: matchId,
        status: { in: [MatchStatus.DONE, MatchStatus.NO_SHOW] },
      },
    },
    data: {
      resolved: true,
      verdict:
        verdict ?? 'Issue automatically dismissed. Match is already closed.',
    },
  })

  const ticket = await prisma.ticket.findFirst({ where: { matchId } })

  await pubsub.publish(
    Ticket.$name,
    ticket?.id,
    'closeMatchTickets',
    ticket ?? undefined
  )
  return ticket
}
