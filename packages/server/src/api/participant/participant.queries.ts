import { extendType, idArg, nonNull } from 'nexus'
import { isUserRegistered } from '../../helpers/isUserRegistered'
import { isUserCheckedIn } from '../../helpers/isUserCheckedIn'
import { ParticipantRoleType } from '@prisma/client'

export const ParticipantQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('participants', {
      type: 'Participant',
      resolve: async (_, __, { prisma }) => prisma.participant.findMany({}),
    })
    t.nonNull.list.nonNull.field('participantsFromTournament', {
      args: { tournamentId: nonNull(idArg()) },
      type: 'Participant',
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.participant.findMany({ where: { tournamentId } }),
    })
    t.nonNull.list.nonNull.field('playersFromTournament', {
      args: { tournamentId: nonNull(idArg()) },
      type: 'Participant',
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.participant.findMany({
          where: {
            tournamentId,
            roles: { some: { type: ParticipantRoleType.PLAYER } },
          },
        }),
    })
    t.nonNull.list.nonNull.field('staffFromTournament', {
      args: { tournamentId: nonNull(idArg()) },
      type: 'Participant',
      resolve: async (_, { tournamentId }, { prisma }) =>
        prisma.participant.findMany({
          where: {
            tournamentId,
            roles: {
              some: {
                type:
                  ParticipantRoleType.MODERATOR ||
                  ParticipantRoleType.HOST ||
                  ParticipantRoleType.ADMIN,
              },
            },
          },
        }),
    })
    t.field('isRegistered', {
      type: 'Boolean',

      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { tournamentId }, { prisma, user }) =>
        isUserRegistered({
          prisma,
          userId: user.id,
          tournamentId,
        }),
    })
    t.field('isCheckedIn', {
      type: 'Boolean',

      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { tournamentId }, { prisma, user }) =>
        isUserCheckedIn({
          prisma,
          userId: user.id,
          tournamentId,
        }),
    })
    t.list.field('userParticipants', {
      type: 'Participant',
      resolve: async (_, __, { prisma, user }) =>
        prisma.participant.findMany({ where: { userId: user.id } }),
    })
  },
})
