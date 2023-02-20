import { Ticket, TicketType } from '@prisma/client'
import { mockTournament } from './mockTournament'

export const mockTicket: Ticket = {
  id: 'ticket1',
  number: 1,
  tournamentId: mockTournament.id,
  type: TicketType.SCORE_CONFLICT,
  verdict: null,
  assigneeId: null,
  matchBlocked: false,
  matchId: null,
  message: 'Ticket Message',
  reportedId: null,
  reporterId: null,
  resolved: false,
}
