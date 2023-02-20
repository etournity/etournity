import { objectType, idArg, nonNull } from 'nexus'
import { Participant } from 'nexus-prisma'

export const ParticipantType = objectType({
  name: Participant.$name,
  definition(t) {
    t.field(Participant.id)
    t.field(Participant.roles)
    t.field(Participant.checkedInAt)
    t.field(Participant.registeredAt)
    t.field(Participant.team)
    t.field(Participant.teamId)
    t.field(Participant.readyChecks)
    t.field(Participant.requestingMod)
    t.field(Participant.deniedMod)
    t.field(Participant.tournament)
    t.field(Participant.tournamentId)
    t.field(Participant.user)
    t.field(Participant.userId)
    t.field(Participant.kicked)
    t.boolean('isCheckedIn', {
      resolve: (participant) => participant.checkedInAt !== null,
    })
    t.boolean('isRegistered', {
      resolve: (participant) => participant.registeredAt !== null,
    })
    t.boolean('isCreator', {
      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (participant, { matchId }, { prisma }) =>
        (await prisma.readyCheck.count({
          where: {
            lobbyRole: 'creator',
            participantId: participant.id,
            matchId,
          },
        })) === 1,
    })
    t.boolean('isCurrentUser', {
      resolve: async (participant, __, { prisma, user }) =>
        (await prisma.participant.findUnique({ where: { id: participant.id } }))
          ?.userId === user?.id,
    })
    t.boolean('isReady', {
      args: { matchId: nonNull(idArg()) },
      resolve: async (participant, { matchId }, { prisma }) =>
        (await prisma.readyCheck.count({
          where: { matchId, participantId: participant.id },
        })) === 1,
    })
    t.boolean('isPlayer', {
      resolve: async (participant, _, { prisma }) =>
        (await prisma.participantRole.count({
          where: { participantId: participant.id, type: 'PLAYER' },
        })) > 0,
    })
    t.boolean('isModerator', {
      resolve: async (participant, _, { prisma }) =>
        (await prisma.participantRole.count({
          where: { participantId: participant.id, type: 'MODERATOR' },
        })) > 0,
    })
    t.boolean('isHost', {
      resolve: async (participant, _, { prisma }) =>
        (await prisma.participantRole.count({
          where: { participantId: participant.id, type: 'HOST' },
        })) > 0,
    })
  },
})
