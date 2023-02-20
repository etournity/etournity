import { useReactiveVar } from '@apollo/client'
import {
  MatchStatus,
  TournamentStatus,
  useGetUserInfoQuery,
  User,
  ParticipantRoleType,
  useTournamentChangedSubscription,
  useMatchChangedSubscription,
} from '@generated/graphql'
import { authVar } from '@state/authVar'
import { Except } from 'type-fest'

export interface CurrentHost {
  id: string
  tournament?: { id: string; status: TournamentStatus } | null
}

export interface CurrentMatch {
  id: string
  status: MatchStatus
  opponents?: Array<{
    id: string
    name: string
  }> | null
}
export interface CurrentTournament {
  id: string
  title: string
}
export interface CurrentParticipant {
  id: string
  kicked: boolean
  roles: Array<{ id: string; type: ParticipantRoleType }>
  tournament?: CurrentTournament | null
  team?: {
    id: string
  } | null
}
export interface AuthUser
  extends Except<
    User,
    | 'participants'
    | 'gameUsers'
    | 'currentHost'
    | 'currentMatch'
    | 'currentParticipant'
    | 'linkedAccounts'
  > {
  currentHost?: CurrentHost | null | undefined
  currentMatch?: CurrentMatch | null | undefined
  currentParticipant?: CurrentParticipant | null | undefined
  linkedAccounts?:
    | Array<{
        userId: string
        avatar?: string | null
        username: string
        discriminator: string
      }>
    | null
    | undefined
}

interface AuthReturn {
  user: AuthUser | undefined
  loading: boolean
  authenticated: boolean | undefined
  expires: Date | undefined
  logout: () => void
}

export const useAuth = (): AuthReturn => {
  const { authenticated, expires, userId } = useReactiveVar(authVar)
  const { client, data, loading, refetch } = useGetUserInfoQuery({
    skip: !userId,
    variables: { userId: userId ?? '' },
    onError: console.error,
  })

  useTournamentChangedSubscription({
    variables: {
      tournamentId: data?.user?.currentParticipant?.tournament?.id ?? '',
    },
    skip: !data?.user?.currentParticipant?.tournament,
    onSubscriptionData: () => refetch(),
  })
  useMatchChangedSubscription({
    variables: { matchId: data?.user?.currentMatch?.id ?? '' },
    skip: !data?.user?.currentMatch,
    onSubscriptionData: () => refetch(),
  })
  const logout = () => {
    authVar({
      authenticated: false,
      userId: undefined,
      expires: undefined,
    })
    client.resetStore()
  }

  return {
    user: data?.user ?? undefined,
    loading,
    authenticated,
    expires,
    logout,
  }
}
