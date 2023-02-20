import { Prisma, PrismaClient, ParticipantRoleType } from '@prisma/client'
import { PubSubHandler } from './pubSubHelper'
import { Tournament } from 'nexus-prisma'

export const removeUnregisteredParticipants = async (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
  pubsub: PubSubHandler,
  tournamentId: string
) => {
  if (!tournamentId) throw new Error('Tournament ID is required')

  const participants = await prisma.participant.deleteMany({
    where: {
      tournamentId,
      registeredAt: null,
      requestingMod: false,
      roles: {
        none: {
          type: {
            in: [
              ParticipantRoleType.MODERATOR,
              ParticipantRoleType.PLAYER,
              ParticipantRoleType.HOST,
              ParticipantRoleType.ADMIN,
            ],
          },
        },
      },
    },
  })

  await pubsub.publish(
    Tournament.$name,
    tournamentId,
    'removeUnregisteredParticipants'
  )

  return participants
}
