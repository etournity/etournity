import { useAuth } from './useAuth'
import {
  Match,
  useMatchChangedSubscription,
  useMatchInfoQuery,
} from '@generated/graphql'
import { toast } from 'react-hot-toast'

interface ActiveMatch {
  match: Match
  userReady: boolean
  userIsCreator: boolean
  participantCount: number
  allScoresSubmitted: boolean
  userHasSubmitted: boolean
  noShowMinutes: number | undefined
}

export const useActiveMatch = (): ActiveMatch | undefined => {
  const { user } = useAuth()
  const { data } = useMatchInfoQuery({
    variables: { matchId: user?.currentMatch?.id ?? '' },
    skip: !user?.currentMatch,
    onError: () => {
      toast.error('Error loading match info')
    },
  })

  useMatchChangedSubscription({
    skip: !data?.match?.id,
    variables: {
      matchId: data?.match?.id ?? '',
    },
  })

  const match = data?.match
  if (!match) {
    return undefined
  }

  const userReady = match.opponents.some((team) =>
    team.participants.some(
      (participant) => participant.user.id === user?.id && participant.isReady
    )
  )
  const userIsCreator = match.opponents.some((team) =>
    team.participants.some(
      (participant) => participant.user.id === user?.id && participant.isCreator
    )
  )
  const participantCount = match.opponents.reduce(
    (c, v) => c + v.participants.length,
    0
  )
  const allScoresSubmitted = match.matchGames.every(
    ({ submissions }) => submissions.length === match.opponents.length
  )

  const userTeam = match.opponents.find(({ participants }) =>
    participants.some((participant) => participant.user.id === user?.id)
  )
  const userHasSubmitted =
    match.matchGames.filter(({ submissions }) =>
      submissions.some(({ teamId }) => teamId === userTeam?.id)
    ).length >= Math.ceil((match.round?.format ?? 1) / 2)

  const noShowMinutes = match.round?.stage?.tournament.noShow
  return {
    match: match as Match,
    userReady,
    userIsCreator,
    participantCount,
    allScoresSubmitted,
    userHasSubmitted,
    noShowMinutes,
  }
}
