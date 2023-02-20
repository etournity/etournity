import { Match, Team } from '@app/generated/graphql'
import { AuthUser } from '@hooks/useAuth'

export enum LobbyPage {
  CheckIn = 'checkIn',
  CreateLobby = 'createLobby',
  JoinLobby = 'joinLobby',
  Scores = 'scores',
  Compare = 'compare',
  Results = 'results',
  Resolve = 'resolve',
  Error = 'error',
  Loading = 'loading',
  InProgress = 'inProgress',
}
export interface LobbyPageProps {
  match: Match
  user: AuthUser
  isInMatch?: boolean
  switchTo: (to: LobbyPage) => void
  currentTeam?: Team
  opponentTeam?: Team
  creatorTeam?: Team
  guestTeam?: Team
}
