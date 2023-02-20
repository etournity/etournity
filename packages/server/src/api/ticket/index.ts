import { TicketType } from './ticket.type'
import { TicketQueries } from './ticket.queries'
import { TicketMutations } from './ticket.mutations'
import { TicketSubscriptions } from './ticket.subscriptions'

export const TicketSchema = [
  TicketType,
  TicketQueries,
  TicketMutations,
  TicketSubscriptions,
]
