import {
  Prisma,
  PrismaClient,
  TournamentStatus,
  ParticipantRoleType,
} from '@prisma/client'

export const getCurrentTournament = async (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
  userId: string,
  tournamentRole?: ParticipantRoleType
) =>
  prisma.tournament.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              userId,
            },
          },
        },
        {
          status: {
            in: [TournamentStatus.STARTED, TournamentStatus.ERROR],
          },
        },
      ],
    },
    include: {
      participants: tournamentRole
        ? {
            where: { roles: { some: { type: tournamentRole } } },
          }
        : true,
    },
  })
