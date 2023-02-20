import { Prisma, PrismaClient } from '@prisma/client'

interface CompareScoresInput {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
  matchGameId: string
}

/**
 * A function that compares the scores of all teams who submitted to a matchGame.
 * @param {string} matchGameId matchGame, of which to compare the scores
 * @returns {boolean} - Indicates whether submitted scores are equal
 */
export const compareScores = async ({
  prisma,
  matchGameId,
}: CompareScoresInput): Promise<boolean> => {
  const submissions = await prisma.submission.findMany({
    where: { matchGameId },
    include: { results: true },
  })

  const teamScores = await Promise.all(
    submissions.map(async (submission) => {
      const results = await prisma.result.findMany({
        where: {
          submission: { matchGameId },
          teamId: submission.teamId,
        },
      })

      // Reset results already marked as final
      if (results.some((result) => result.matchGameId !== null)) {
        await prisma.result.updateMany({
          where: {
            submission: { matchGameId },
            teamId: submission.teamId,
          },
          data: { matchGameId: null },
        })
      }

      return results?.map((result) => ({
        id: result.id,
        score: result?.score ?? 0,
      }))
    })
  )

  const noConflict = teamScores.every(
    (teamScore) => teamScore[0].score === teamScore[1].score
  )

  await Promise.all(
    teamScores.map((teamScore) => {
      if (teamScore[0].score === teamScore[1].score) {
        return prisma.result.update({
          where: {
            id: teamScore[0].id,
          },
          data: {
            matchGameId: noConflict ? matchGameId : null,
          },
        })
      }

      return null
    })
  )

  return noConflict
}
