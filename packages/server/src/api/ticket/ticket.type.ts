import { objectType } from 'nexus'
import { Ticket } from 'nexus-prisma'

export const TicketType = objectType({
  name: 'Ticket',
  definition(t) {
    t.field(Ticket.id)
    t.field(Ticket.type)
    t.field(Ticket.resolved)
    t.field(Ticket.matchBlocked)
    t.field(Ticket.match)
    t.field(Ticket.matchId)
    t.field(Ticket.message)
    t.field(Ticket.verdict)
    t.field(Ticket.tournament)
    t.field(Ticket.tournamentId)
    t.field(Ticket.reporter)
    t.field(Ticket.assignee)
    t.field(Ticket.reported)
    t.field(Ticket.number)
  },
})
