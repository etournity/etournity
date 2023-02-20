import { UserAccountType } from './userAccount.type'
import { UserAccountMutations } from './userAccount.mutations'
import { UserAccountQueries } from './userAccount.queries'

export const UserAccountSchema = [
  UserAccountType,
  UserAccountMutations,
  UserAccountQueries,
]
