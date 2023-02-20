import { useEffect, useState } from 'react'
import { LobbyPage } from '@components/tournament/lobby'
import { AuthUser, useAuth } from '@hooks/useAuth'
import {
  Match,
  Participant,
  useMatchInfoQuery,
  MatchStatus,
  useMatchChangedSubscription,
  GameStatus,
} from '@generated/graphql'

interface MatchLobbyPageProps {
  matchId: string
}

interface MatchLobbyPageReturn {
  page: LobbyPage
  setPage: (page: LobbyPage) => void
  loading: boolean
  user?: AuthUser
  match?: Match
}

export const useMatchlobbyPage = ({
  matchId,
}: MatchLobbyPageProps): MatchLobbyPageReturn => {
  const [page, setPage] = useState<LobbyPage>(LobbyPage.Loading)
  const auth = useAuth()
  const user = auth?.user

  const { data, loading } = useMatchInfoQuery({
    skip: !matchId,
    variables: {
      matchId,
    },

    onError: console.error,
  })
  const match = data?.match as Match

  const participant = match?.opponents
    ?.flatMap((team): Participant | undefined => {
      const p = team.participants.find(
        (participant) => participant.id === user?.currentParticipant?.id
      )
      if (!p) return undefined
      return { ...p, team }
    })
    .find((p) => p?.id !== undefined)

  useMatchChangedSubscription({
    skip: !matchId,
    variables: {
      matchId,
    },
  })

  useEffect(() => {
    setPage(getCurrentPage(participant, match, user))
  }, [match, user, participant])

  return {
    page,
    setPage: (page: LobbyPage) => setPage(page),
    loading: auth?.loading || loading,
    user,
    match,
  }
}

/**
 *  Set Page depending on users progress in the matchlobby.
 **/

const getCurrentPage = (
  participant:
    | Pick<Participant, 'id' | 'isCreator' | 'isReady' | 'team'>
    | undefined,
  match?: Match,
  user?: AuthUser
): LobbyPage => {
  if (!match || !user) return LobbyPage.Error
  if (!participant) {
    if (![MatchStatus.Done, MatchStatus.NoShow].includes(match?.status))
      return LobbyPage.InProgress
    return LobbyPage.Results
  }

  // Return an error page on error or unavailable object
  if (!user.currentParticipant || match.status === MatchStatus.Error)
    return LobbyPage.Resolve

  const allReady = match.opponents.every(
    (opponent) => opponent.participantsReady === opponent.participants.length
  )
  const isCreator = participant?.isCreator
  const allScoresSubmitted = match.opponents.every(
    (opponent) => opponent.allScoresSubmitted
  )

  const gamesInConflict = match.matchGames.some((matchGame) =>
    [GameStatus.Conflict, GameStatus.ManualEdit].includes(matchGame.status)
  )
  const allScoresResubmitted = match.matchGames.every(
    (matchGame) =>
      matchGame.submissions.filter((submission) => submission.resubmitted)
        .length >= match.opponents.length
  )
  const myScoresResubmitted = match.matchGames.every(
    (matchGame) =>
      matchGame.submissions.filter(
        (submission) =>
          submission.teamId === participant?.team?.id && submission.resubmitted
      ).length > 0
  )
  if (match.status === MatchStatus.Done) return LobbyPage.Results

  // If players arent ready return Checkin page
  if (!allReady) return LobbyPage.CheckIn

  // If there is no gameLobbyCode and user is creator, return CreateLobby page
  if (isCreator && !match.gameLobbyCode) return LobbyPage.CreateLobby
  // If user is not ingame return Scores page
  if (
    match.inGame.includes(user.currentParticipant.id) &&
    (!allScoresSubmitted || (gamesInConflict && !allScoresResubmitted))
  )
    return LobbyPage.Scores

  // If scores have been submitted return Compare page
  if (
    (!gamesInConflict && allScoresSubmitted) ||
    (gamesInConflict &&
      (myScoresResubmitted ||
        (!myScoresResubmitted &&
          !match.inGame.includes(user.currentParticipant.id))))
  )
    return LobbyPage.Compare

  // Otherwise return JoinLobby page
  return LobbyPage.JoinLobby
}
