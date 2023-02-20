import { makeVar } from '@apollo/client'
import { Ticket } from '@generated/graphql'

export const ticketsVar = makeVar<Ticket[]>([])
