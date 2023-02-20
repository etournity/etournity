import { Prisma, PrismaClient } from '@prisma/client'

interface isUserRegisteredInput {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
  userId: string
  tournamentId: string
}

/**
 * Check if a user has been registered in a tournament
 * @param {string} userId the user id to check against
 * @param {string} tournamentId the tournament to check the user's registration in
 */
export const isUserRegistered = async ({
  prisma,
  userId,
  tournamentId,
}: isUserRegisteredInput): Promise<boolean> => {
  const participant = await prisma.participant.findUnique({
    where: {
      participant_userId_tournamentId_key: {
        tournamentId,
        userId,
      },
    },
  })

  return participant !== null
}
