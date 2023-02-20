import { NextRouter } from 'next/router'
import { createContext } from 'react'

export enum NavPath {
  Tournaments = 'tournaments',
  MatchLobby = 'lobby',
  HostHub = 'hub',
  Brackets = 'brackets',
  InfoPage = 'infoPage',
}

export const getActivePath = (router: NextRouter): NavPath | null => {
  const path = router.route
  if (path === '/tournaments') {
    return NavPath.Tournaments
  }

  if (path === `/tournament/[tournamentId]`) {
    return NavPath.InfoPage
  }

  if (path === `/lobby/[matchId]`) {
    return NavPath.MatchLobby
  }

  if (path === `/tournament/[tournamentId]/brackets`) {
    return NavPath.Brackets
  }

  if (path === `/tournament/[tournamentId]/hub`) {
    return NavPath.HostHub
  }

  return null
}

export const NavContext = createContext<NavPath | null>(null)
