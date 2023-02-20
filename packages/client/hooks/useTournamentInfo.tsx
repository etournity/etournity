import { tournamentsVar, TournamentInfo } from '@state/tournaments'
import {
  ParticipantRoleType,
  Tournament,
  Stage,
  useTournamentInfoQuery,
  useTournamentStagesInfoLazyQuery,
  useTournamentChangedSubscription,
} from '@generated/graphql'
import { useReactiveVar } from '@apollo/client'
import { toast } from 'react-hot-toast'

export const useTournamentInfo = (tournamentId: string | undefined) => {
  const getTournamentInfo = (tournament: Tournament | undefined) => {
    if (!tournament) return undefined

    const currentParticipant = tournament?.participants?.find(
      (p) => p.isCurrentUser
    )

    const userIsRegistered = currentParticipant?.isRegistered ?? false

    const userIsStaff =
      currentParticipant?.roles.some(({ type }) =>
        [
          ParticipantRoleType.Admin,
          ParticipantRoleType.Host,
          ParticipantRoleType.Moderator,
        ].includes(type)
      ) ?? false

    const bracketsReady = (tournament?.stages?.[0]?.rounds?.length ?? 0) > 0

    return {
      tournament,
      currentParticipant,
      userIsRegistered,
      userIsStaff,
      bracketsReady,
    }
  }

  const currentIsCached = (tournamentId: string | undefined) =>
    tournamentsVar().some(({ tournament }) => tournament?.id === tournamentId)

  const [
    stagesQuery,
    { loading: stagesLoading, error: stagesError },
  ] = useTournamentStagesInfoLazyQuery()

  const { loading, error, refetch } = useTournamentInfoQuery({
    variables: { tournamentId: tournamentId ?? '' },
    skip: !tournamentId,
    onCompleted: (data) => {
      if (data?.tournament) {
        stagesQuery({
          variables: { tournamentId: tournamentId ?? '' },
        })
          .then((stages) => {
            const stagesInfo = stages.data?.tournamentStages as Stage[]
            const tournamentInfo: TournamentInfo = getTournamentInfo(
              { ...(data?.tournament as Tournament), stages: stagesInfo } ??
                undefined
            ) ?? {
              tournament: undefined,
              currentParticipant: undefined,
              userIsRegistered: false,
              userIsStaff: false,
              bracketsReady: false,
            }
            tournamentsVar(
              currentIsCached(tournamentId)
                ? tournamentsVar().map((data) => {
                    if (data.tournament?.id === tournamentInfo.tournament?.id) {
                      const newTournament:
                        | Tournament
                        | undefined = tournamentInfo.tournament
                        ? {
                            ...tournamentInfo.tournament,
                            stages: stagesInfo,
                          }
                        : undefined
                      return getTournamentInfo(newTournament) ?? data
                    }

                    return data
                  })
                : [
                    ...tournamentsVar(),
                    {
                      ...tournamentInfo,
                      tournament: tournamentInfo?.tournament
                        ? {
                            ...tournamentInfo.tournament,
                            stages: stagesInfo,
                          }
                        : undefined,
                    },
                  ]
            )
          })
          .catch((err) => {
            console.error(err)
            toast.error(err.message)
          })
      }
    },
  })

  useTournamentChangedSubscription({
    variables: { tournamentId: tournamentId ?? '' },
    skip: !tournamentId,
    onSubscriptionData: ({ subscriptionData }) => {
      const changedTournament = subscriptionData.data
        ?.tournamentChanged as Tournament
      tournamentsVar(
        tournamentsVar().map((tournamentInfo) =>
          tournamentInfo.tournament?.id === tournamentId
            ? getTournamentInfo(changedTournament ?? undefined) ??
              tournamentInfo
            : tournamentInfo
        )
      )
    },
  })

  return {
    ...(useReactiveVar(tournamentsVar).find(
      (t) => t.tournament?.id === tournamentId
    ) ?? {
      tournament: undefined,
      currentParticipant: undefined,
      userIsRegistered: false,
      userIsStaff: false,
      bracketsReady: false,
    }),
    loading,
    stagesLoading,
    error,
    stagesError,
    updateTournament: refetch,
  }
}
