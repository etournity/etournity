import { objectType } from 'nexus'
import { Submission } from 'nexus-prisma'

export const SubmissionType = objectType({
  name: 'Submission',
  definition(t) {
    t.field(Submission.id)
    t.field(Submission.matchGame)
    t.field(Submission.matchGameId)
    t.field(Submission.results)
    t.field(Submission.team)
    t.field(Submission.teamId)
    t.field(Submission.resubmitted)
  },
})
