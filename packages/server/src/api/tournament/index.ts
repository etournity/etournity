import { TournamentType } from './tournament.type'
import { TournamentQueries } from './tournament.queries'
import { TournamentSubscriptions } from './tournament.subscriptions'
import {
  TournamentMutations,
  TournamentCreateInput,
} from './tournament.mutations'

export const TournamentSchema = [
  TournamentType,
  TournamentQueries,
  TournamentMutations,
  TournamentSubscriptions,
  TournamentCreateInput,
]
