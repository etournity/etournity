import { ApolloError } from '@apollo/client/errors'
import {
  Round,
  MatchStatus,
  useBracketGenInfoQuery,
  useGenerateBracketsMutation,
  usePublishBracketsMutation,
} from '@generated/graphql'
import { useState } from 'react'
import { BracketVizRound } from '@components/tournament/bracketViz'
import { useAuth } from '@hooks/useAuth'
import dayjs from 'dayjs'

enum GenerationAlgorithm {
  SEED = 'seed',
  RANDOM = 'random',
}
export interface BestOfInput {
  roundId: string
  bestOf: number
}
export const useGenerateBrackets = (
  tournamentId: string
): {
  generateBrackets: (algorithm?: GenerationAlgorithm) => void
  rounds?: BracketVizRound[]
  loading: boolean
  generationAllowed?: boolean
  error?: ApolloError

  publishBrackets: (bestOfs: BestOfInput[]) => Promise<void>
} => {
  const { data, loading, error, refetch } = useBracketGenInfoQuery({
    variables: { tournamentId },
    skip: !tournamentId,
  })
  const tournament = data?.tournament
  type Tournament = typeof tournament
  const [generateBracketsMutation] = useGenerateBracketsMutation({
    fetchPolicy: 'no-cache',
  })
  const [publishBracketsMutation] = usePublishBracketsMutation()
  const auth = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [rounds, setRounds] = useState<BracketVizRound[] | undefined>(undefined)
  const [publishInput, setPublishInput] = useState<Array<
    Array<Array<string | null>>
  > | null>(null)

  const getTeamInfo = (tournament: Tournament, teamId: string | null) => {
    const allTeams = tournament?.participants?.map(
      (participant) => participant?.team
    )
    const team = allTeams?.find((team) => team?.id === teamId)
    return { ...team }
  }

  const generationAllowed = dayjs().isAfter(data?.tournament?.checkinEnd)

  const getMappedRoundsInfo = (
    tournament: Tournament,
    rounds?: Round[],
    publishInput?: Array<Array<Array<string | null>>>
  ): BracketVizRound[] | undefined => {
    let roundCount = 0
    if (rounds)
      return rounds.map((round) => ({
        id: round.id,
        number: round.number,
        bestOf: round.format ?? 3,
        matches: round.matches?.map((match) => {
          roundCount += 1
          return {
            id: match.id,
            number: match.number ?? roundCount,
            status: match?.status ?? MatchStatus.Scheduled,
            teamResults: match?.opponents?.map((team) => ({
              team: {
                id: team?.id,
                name: team?.name,
                seed: team.seed ?? 0,
                avatar: team.avatar ?? '',
              },
            })),
          }
        }),
      }))
    if (publishInput && tournament?.stages?.[0].rounds) {
      return tournament.stages[0].rounds?.map((round, i) => ({
        id: round.id,
        number: round?.number,
        bestOf: round?.format ?? 3,
        matches: publishInput[i]
          ? publishInput[i].map((_, j) => {
              roundCount += 1
              return {
                number: roundCount,
                status: MatchStatus.Scheduled,
                teamResults: publishInput[i][j].map((teamId) => ({
                  team: {
                    id: teamId,
                    name: getTeamInfo(tournament, teamId).name ?? null,
                    seed: getTeamInfo(tournament, teamId).seed ?? null,
                    avatar: getTeamInfo(tournament, teamId).avatar ?? null,
                  },
                })),
              }
            })
          : [],
      }))
    }

    return undefined
  }

  const generateBrackets = async (
    algorithm?: GenerationAlgorithm
  ): Promise<void> => {
    setIsLoading(true)
    await generateBracketsMutation({
      variables: { tournamentId, algorithm: algorithm ?? 'seed' },
    }).then(async ({ data }) => {
      if (data) {
        await refetch?.().then(({ data: tournamentInfo }) => {
          setRounds(
            getMappedRoundsInfo(
              tournamentInfo.tournament,
              undefined,
              data.generateBrackets
            )
          )
          setPublishInput(data.generateBrackets)
        })
      }
    })
    setIsLoading(false)
  }

  const publishBrackets = async (bestOfs: BestOfInput[]) => {
    if (!publishInput)
      throw Error('You need to generate Brackets before publishing them!')
    publishBracketsMutation({
      variables: { tournamentId, publishInput, bestOfs },
    })
  }

  return {
    generateBrackets,
    publishBrackets,
    loading: (loading || isLoading || auth?.loading) ?? false,
    error,
    rounds,
    generationAllowed,
  }
}
