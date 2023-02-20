import { Prisma, PrismaClient } from '@prisma/client'

interface isUserCheckedInInput {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
  userId: string
  tournamentId: string
}

/**
 * Check if a user has checked into a tournament
 * @param {string} userId the user id to check against
 * @param {string} tournamentId the tournament to check the user's registration in
 */
export const isUserCheckedIn = async ({
  prisma,
  userId,
  tournamentId,
}: isUserCheckedInInput): Promise<boolean> => {
  const participant = await prisma.participant.findUnique({
    where: {
      participant_userId_tournamentId_key: {
        tournamentId,
        userId,
      },
    },
  })

  return participant?.checkedInAt !== null
}
