import { objectType } from 'nexus'
import { Result } from 'nexus-prisma'

export const ResultType = objectType({
  name: 'Result',
  definition(t) {
    t.field(Result.id)
    t.field(Result.score)
    t.field(Result.submission)
    t.field(Result.submissionId)
    t.field(Result.team)
    t.field(Result.teamId)
  },
})
