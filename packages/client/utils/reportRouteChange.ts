import mixpanel from 'mixpanel-browser'

export const reportRouteChange = (pathname: string, userId: string) => {
  if (!process.env.MIXPANEL_TOKEN) return

  mixpanel.init(process.env.MIXPANEL_TOKEN, {
    api_host: 'https://api-eu.mixpanel.com',
  })
  let eventName = ''
  switch (pathname) {
    case '/':
      eventName = 'TournamentList'
      break
    case '/tournament/new':
      eventName = 'Creation'
      break
    case '/tournament/[tournamentId]':
      eventName = 'InfoPage'
      break
    case '/tournament/[tournamentId]/hub':
      eventName = 'HostHub'
      break
    case '/tournament/[tournamentId]/hub/generate':
      eventName = 'Bracket Generation'
      break
    case '/lobby/[matchId]':
      eventName = 'MatchLobby'
      break
    default:
      eventName = pathname
  }

  mixpanel.track(eventName, { distinct_id: userId })
}
