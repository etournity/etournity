import { TournamentStatus } from '@prisma/client'
import { AuthenticationError } from 'apollo-server-errors'
import { arg, extendType, idArg, nonNull, list } from 'nexus'
import { Tournament, ParticipantRoleType } from 'nexus-prisma'

export const TournamentQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('tournaments', {
      type: Tournament.$name,
      args: {
        userHasParticipantRoles: list(
          nonNull(
            arg({
              type: ParticipantRoleType.name,
              description:
                'Filter returned tournaments by users participation or all if omitted.',
            })
          )
        ),
      },
      resolve: async (_, { userHasParticipantRoles }, { user, prisma }) => {
        if (userHasParticipantRoles && !user)
          throw new AuthenticationError(
            'Unable to get User. Please log in first.'
          )
        const tournaments = await prisma.tournament.findMany({
          where: {
            participants: userHasParticipantRoles
              ? {
                  some: {
                    userId: user.id ?? '',
                    roles: {
                      some: { type: { in: userHasParticipantRoles } },
                    },
                  },
                }
              : undefined,
          },
          orderBy: { date: 'desc' },
          include: {
            participants: { select: { id: true, roles: true, userId: true } },
          },
        })

        // Only return draft tournaments for their creator
        return tournaments.filter((tournament) => {
          const userIsHost =
            tournament.participants.find((participant) =>
              participant.roles.some(
                (role) => role.type === ParticipantRoleType.members[1]
              )
            )?.userId === user?.id
          if (tournament.status === TournamentStatus.DRAFT && !userIsHost)
            return false

          return true
        })
      },
    })
    t.field('tournament', {
      type: Tournament.$name,

      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.tournament.findUnique({ where: { id: tournamentId } }),
    })
  },
})
