import {
  arg,
  booleanArg,
  enumType,
  extendType,
  idArg,
  list,
  nonNull,
  stringArg,
} from 'nexus'
import { ParticipantRoleType, MatchStatus } from '@prisma/client'
import { closeTicket } from '../../helpers/closeTicket'
import dayjs from 'dayjs'
import { Tournament, ParticipantRoleType as NexusPRT } from 'nexus-prisma'

export const ParticipantMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateParticipantRoles', {
      type: 'Participant',

      args: {
        participantId: nonNull(idArg()),
        addRoles: list(nonNull(arg({ type: NexusPRT.name }))),
        removeRoles: list(nonNull(arg({ type: NexusPRT.name }))),
        deniedMod: booleanArg(),
        ticketId: idArg(),
        verdict: stringArg(),
      },
      resolve: async (
        _,
        { participantId, addRoles, removeRoles, deniedMod, ticketId, verdict },
        { prisma, pubsub, user }
      ) => {
        let participant = await prisma.participant.findUnique({
          where: { id: participantId },
          include: { roles: true },
        })
        if (!participant) throw new Error('Participant not found!')

        const tournament = await prisma.tournament.findUnique({
          where: { id: participant.tournamentId ?? '' },
          include: { participants: true },
        })

        const currentRoles = participant.roles.map((role) => role.type)

        const filteredRoles = currentRoles.filter(
          (role) => !removeRoles?.includes(role)
        )

        // If roles should be added, delete duplicates and concat
        const newRoles = addRoles?.every((role) => role !== null)
          ? filteredRoles
              ?.filter((role) => !addRoles.includes(role))
              .concat(addRoles as ParticipantRoleType[])
          : filteredRoles

        if (!newRoles && !deniedMod) return null
        participant = (
          await prisma.$transaction([
            prisma.participantRole.deleteMany({
              where: { participantId },
            }),
            prisma.participant.update({
              where: { id: participantId },
              data: {
                roles: { create: newRoles.map((role) => ({ type: role })) },
                requestingMod: deniedMod
                  ? false
                  : newRoles.includes(ParticipantRoleType.MODERATOR)
                  ? false
                  : undefined,
                deniedMod: deniedMod ?? undefined,
              },
              include: { roles: true },
            }),
          ])
        )[1]

        if (
          dayjs().isBefore(tournament?.checkinEnd) &&
          participant.roles.length === 0 &&
          !participant.requestingMod &&
          participant.teamId
        ) {
          await prisma.team.delete({ where: { id: participant.teamId } })
        }

        if (ticketId)
          await closeTicket({ prisma, pubsub, user }, ticketId, verdict)
        await pubsub.publish(
          Tournament.$name,
          tournament?.id,
          'updateParticipantRoles',
          {
            ...tournament,
            participants: tournament?.participants.map((p) =>
              p.id === participant?.id ? participant : p
            ),
          }
        )
        return participant
      },
    })
  },
})
