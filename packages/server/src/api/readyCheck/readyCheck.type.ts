import { objectType } from 'nexus'
import { ReadyCheck } from 'nexus-prisma'

export const ReadyCheckType = objectType({
  name: 'ReadyCheck',
  definition(t) {
    t.field(ReadyCheck.id)
    t.field(ReadyCheck.match)
    t.field(ReadyCheck.matchId)
    t.field(ReadyCheck.checkedInAt)
    t.field(ReadyCheck.lobbyRole)
    t.field(ReadyCheck.participant)
  },
})
