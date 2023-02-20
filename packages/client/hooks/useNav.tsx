import { useContext } from 'react'
import {
  useAuth,
  CurrentHost,
  CurrentMatch,
  CurrentTournament,
} from './useAuth'
import { NavContext } from '@utils/navContext'
import { ParticipantRoleType } from '@generated/graphql'

export enum NavPath {
  Tournaments = 'tournaments',
  MatchLobby = 'lobby',
  HostHub = 'hub',
  Brackets = 'brackets',
  InfoPage = 'infoPage',
}

interface UseNavReturn {
  path: NavPath | null
  activeTournament: CurrentTournament | undefined
  activeMatch: CurrentMatch | undefined
  currentHost: CurrentHost | undefined
  userIsStaff: boolean
}
export const useNav = (): UseNavReturn => {
  const user = useAuth()?.user
  const path = useContext(NavContext)
  const activeMatch = user?.currentMatch ?? undefined
  const activeTournament = user?.currentParticipant?.tournament ?? undefined
  const currentHost = user?.currentHost ?? undefined
  const userIsStaff =
    user?.currentParticipant?.roles.some(({ type }) =>
      [
        ParticipantRoleType.Moderator,
        ParticipantRoleType.Host,
        ParticipantRoleType.Admin,
      ].includes(type)
    ) ?? false

  return {
    path,
    activeTournament,
    activeMatch,
    currentHost,
    userIsStaff,
  }
}
