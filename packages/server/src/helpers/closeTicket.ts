import { Ticket } from 'nexus-prisma'
import { closeMatchTickets } from './closeMatchTickets'
import { endTournament } from './endTournament'
import { Context } from '../context'

export const closeTicket = async (
  ctx: Context,
  ticketId: string,
  verdict?: string | null
) => {
  const { prisma, pubsub, user } = ctx
  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { resolved: true, assigneeId: user.id, verdict },
  })

  // Close other match related tickets if match has ended.
  if (ticket.matchId) {
    await closeMatchTickets(
      ctx,
      ticket.matchId,
      `Issue automatically dismissed. Match closed by ticket number ${ticket.number}.`
    )
  }

  // End tournament if all rounds are played and no opne tickets exist.
  if (ticket.tournamentId) {
    await endTournament(ctx, ticket.tournamentId)
  }

  await pubsub.publish(Ticket.$name, ticket?.id, 'closeTicket', ticket)
  return ticket
}
