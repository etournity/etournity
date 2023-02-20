import {
  Ticket,
  useRelatedTicketsQuery,
  useTournamentTicketChangedSubscription,
} from '@generated/graphql'
import { useNav } from '@hooks/useNav'
import { ticketsVar } from '@state/tickets'

interface TicketsHook {
  tickets: Ticket[]
  refetchTickets: () => void
}

export const useTickets = (): TicketsHook => {
  const { data, refetch } = useRelatedTicketsQuery({})
  const { activeTournament } = useNav()
  ticketsVar((data?.relatedTickets as Ticket[]) ?? [])
  const refetchTickets = () => {
    refetch().then(({ data }) => {
      ticketsVar((data.relatedTickets as Ticket[]) ?? [])
    })
  }

  useTournamentTicketChangedSubscription({
    skip: !activeTournament,
    variables: { tournamentId: activeTournament?.id ?? '' },
    onSubscriptionData: refetchTickets,
  })

  return {
    tickets: ticketsVar(),
    refetchTickets,
  }
}
