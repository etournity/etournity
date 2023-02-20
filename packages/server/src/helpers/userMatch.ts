import {
  Prisma,
  PrismaClient,
  Match,
  MatchStatus,
  RoundStatus,
  TournamentStatus,
} from '@prisma/client'

interface userMatchInput {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
  userId: string
}

/**
 * Search for an active match of a specific user.
 * @param {String} userId the user id to check against
 * @return {Match} activeMatch or null
 */
export const userMatch = async ({
  prisma,
  userId,
}: userMatchInput): Promise<Match | null> =>
  prisma.match.findFirst({
    where: {
      opponents: {
        some: {
          participants: {
            some: {
              user: { id: userId },
            },
          },
        },
      },
      status: {
        notIn: [MatchStatus.SCHEDULED, MatchStatus.DONE, MatchStatus.NO_SHOW],
      },
      round: {
        status: RoundStatus.ACTIVE,
        stage: { tournament: { status: { in: [TournamentStatus.STARTED] } } },
      },
    },
  })
