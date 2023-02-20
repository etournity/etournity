import React from 'react'
import dynamic from 'next/dynamic'
import { Match, useBracketInfoQuery } from '@generated/graphql'
import { BracketVizRound } from '@components/tournament/bracketViz'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/useAuth'
import { DataHandler } from '@handlers/dataHandler'
import { PartialDeep } from 'type-fest'
import { useWindowSize } from '@hooks/useWindowSize'
const BracketViz = dynamic(() => import('@components/tournament/bracketViz'), {
  ssr: false,
})

const BracketViewPage = () => {
  const router = useRouter()
  const auth = useAuth()
  const { contentWidth, contentHeight } = useWindowSize()
  const tournamentId = (router.query.tournamentId as string) || ''
  const { error, loading, data } = useBracketInfoQuery({
    variables: {
      tournamentId,
    },
    onError: console.error,
  })

  const { tournament } = data || {}

  const userTeamId =
    tournament?.participants.find(
      (participant) => participant.user.id === auth?.user?.id
    )?.teamId ?? undefined

  let roundCount = 0

  const rounds:
    | BracketVizRound[]
    | undefined = tournament?.stages[0].rounds.map((round) => ({
    id: round.id,
    number: round?.number,
    bestOf: round?.format,
    matches: round?.matches.map((match) => {
      roundCount += 1
      return {
        id: match?.id,
        number: roundCount,
        status: match?.status,
        teamResults: match?.opponents?.map((team) => ({
          team: {
            id: team?.id,
            name: team?.name,
            seed: team?.seed ?? 1,
            avatar: team?.avatar ?? '',
          },
          score: getScoreForTeam(match, team?.id),
        })),
      }
    }),
  }))

  return (
    <DataHandler
      loading={loading}
      error={error}
      dataAvailable={data !== undefined}
    >
      <BracketViz
        disableAccessWrapper
        rounds={rounds}
        userTeamId={userTeamId}
        width={contentWidth}
        height={contentHeight}
        onMatchClick={(match) => router.push(`/lobby/${match.id}`)}
      />
    </DataHandler>
  )
}

export const getScoreForTeam = (
  match: PartialDeep<Match> | undefined,
  teamId: string
) => {
  const scores = match?.matchGames?.map(
    (game) =>
      game?.finalResults?.find((result) => result?.teamId === teamId)?.score
  )

  return (scores?.length ?? 0) > 0
    ? scores?.reduce((acc, score) => (acc ?? 0) + (score ?? 0)) ?? 0
    : 0
}

export default BracketViewPage
