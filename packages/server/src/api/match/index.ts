import { MatchType } from './match.type'
import { MatchQueries } from './match.queries'
import { MatchMutations, MatchResultInput } from './match.mutations'
import { MatchSubscriptions } from './match.subscriptions'

export const MatchSchema = [
  MatchType,
  MatchQueries,
  MatchMutations,
  MatchSubscriptions,
  MatchResultInput,
]
