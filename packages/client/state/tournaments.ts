import { makeVar } from '@apollo/client'
import { Tournament, Participant } from '@generated/graphql'

export interface TournamentInfo {
  tournament: Tournament | undefined
  currentParticipant: Participant | undefined
  userIsRegistered: boolean
  userIsStaff: boolean
  bracketsReady: boolean
}
export const tournamentsVar = makeVar<TournamentInfo[]>([])
