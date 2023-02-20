import { objectType, idArg, nonNull } from 'nexus'
import { ParticipantRoleType, PrismaClient } from '@prisma/client'
import { Team } from 'nexus-prisma'

export const TeamType = objectType({
  name: Team.$name,
  definition(t) {
    t.field(Team.id)
    t.field(Team.name)
    t.nullable.string('avatar', {
      resolve: async (team, _, { prisma }) => {
        const participant = await prisma.participant.findUnique({
          where: {
            id: team.leaderId ?? '',
          },
          select: {
            userId: true,
          },
        })

        const userAccount = await prisma.userAccount.findFirst({
          where: {
            ownerId: participant?.userId,
          },
        })

        return userAccount?.avatar ?? null
      },
    })
    t.field(Team.leader)
    t.field(Team.leaderId)
    t.field(Team.participants)
    t.field(Team.readyChecks)
    t.field(Team.matches)
    t.field(Team.seed)
    t.float('averageElo', {
      resolve: async (team, _, { prisma }) =>
        getAverageElo({ prisma, teamId: team.id }),
    })
    t.int('participantsReady', {
      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (team, { matchId }, { prisma }) =>
        prisma.participant.count({
          where: {
            teamId: team.id,
            readyChecks: {
              some: {
                matchId,
              },
            },
          },
        }),
    })
    t.boolean('allScoresSubmitted', {
      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (team, { matchId }, { prisma }) => {
        const scoresSubmitted = await prisma.submission.count({
          where: { teamId: team.id, matchGame: { matchId } },
        })
        const round = await prisma.round.findFirst({
          where: { matches: { some: { id: matchId } } },
        })
        /**
         * All scores are submitted when the team has submitted enough game scores to potentially win the match.
         * The submission count has to be higher than 50% of the maximum amount of games to be possibly played.
         * (e.g.: Best-Of 5 -> 3/5 >= 50%)
         */
        return scoresSubmitted >= Math.ceil((round?.format ?? 1) / 2)
      },
    })
    t.boolean('kicked', {
      resolve: async (team, _, { prisma }) => {
        const teamWithParticipants = await prisma.team.findUnique({
          where: { id: team.id },
          include: { participants: { include: { roles: true } } },
        })
        return (
          teamWithParticipants?.participants.every(({ kicked }) => kicked) ??
          false
        )
      },
    })
  },
})

export const getAverageElo = async ({
  prisma,
  teamId,
}: {
  prisma: PrismaClient
  teamId: string
}) => {
  const gameId = (
    await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        participants: {
          select: {
            tournament: {
              select: {
                gameId: true,
              },
            },
          },
        },
      },
    })
  )?.participants?.[0]?.tournament?.gameId

  const gameUsers = await prisma.gameUser.findMany({
    where: {
      user: { participants: { some: { teamId } } },
      game: { id: gameId },
    },
  })
  const elos = gameUsers.map((gameUser) => gameUser.elo)
  return elos.reduce((a, b) => a + b, 0) / elos.length
}
