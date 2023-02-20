import { objectType } from 'nexus'
import { MatchGame } from 'nexus-prisma'

export const MatchGameType = objectType({
  name: MatchGame.$name,
  definition(t) {
    t.field(MatchGame.id)
    t.field(MatchGame.number)
    t.field(MatchGame.match)
    t.field(MatchGame.matchId)
    t.field(MatchGame.status)
    t.field(MatchGame.result)
    t.field(MatchGame.submissions)
    t.nonNull.list.field('finalResults', {
      type: 'Result',

      description: 'The final, confirmed results of the game',
      resolve: async (matchGame, __, { prisma }) =>
        prisma.result.findMany({
          where: {
            matchGameId: matchGame.id,
          },
        }),
    })
    t.field('submissionsEqual', {
      type: 'Boolean',

      description:
        "Returns true if all scores match, false if they don't and null if submissions are missing",
      resolve: async (matchGame, __, { prisma }) => {
        const teams = await prisma.team.findMany({
          where: { matches: { some: { id: matchGame.matchId } } },
          include: {
            results: { where: { submission: { matchGameId: matchGame.id } } },
          },
        })
        const submissions = await prisma.submission.findMany({
          where: { matchGameId: matchGame.id },
          include: { results: true },
        })

        if (teams.length !== submissions.length) return null

        return teams.every((team) => {
          const ownSubmission = submissions.find(
            (Submission) => Submission.teamId === team.id
          )
          const ownResult = ownSubmission?.results?.find(
            (result) => result.teamId === team.id
          )
          const opponentSubmissions = submissions.filter(
            (submission) => submission.teamId !== team.id
          )
          return opponentSubmissions.every((submission) => {
            const teamResult = submission.results.find(
              (result) => result.teamId === team.id
            )
            return teamResult?.score === ownResult?.score
          })
        })
      },
    })
  },
})
