import { objectType } from 'nexus'
import { UserAccount } from 'nexus-prisma'

export const UserAccountType = objectType({
  name: 'UserAccount',
  definition(t) {
    t.field(UserAccount.id)
    t.field(UserAccount.accessToken)
    t.field(UserAccount.avatar)
    t.field(UserAccount.discriminator)
    t.field(UserAccount.email)
    t.field(UserAccount.fetchedAt)
    t.field(UserAccount.locale)
    t.field(UserAccount.mfaEnabled)
    t.field(UserAccount.owner)
    t.field(UserAccount.provider)
    t.field(UserAccount.refreshToken)
    t.field(UserAccount.username)
    t.field(UserAccount.verified)
    t.field(UserAccount.userId)
  },
})
