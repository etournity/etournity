import { extendType, idArg, nonNull } from 'nexus'
import { MatchStatus } from '@prisma/client'
import { Match, ReadyCheck } from 'nexus-prisma'

export const ReadyCheckMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createReadyCheck', {
      type: ReadyCheck.$name,
      args: {
        matchId: nonNull(idArg()),
        participantId: nonNull(idArg()),
      },
      resolve: async (_, { matchId, participantId }, { prisma, pubsub }) => {
        const isFirstCheckin =
          (await prisma.readyCheck.count({ where: { matchId } })) === 0

        let result = await prisma.readyCheck.findUnique({
          where: {
            readyCheck_participantId_matchId_key: {
              matchId,
              participantId,
            },
          },
          include: { match: true },
        })

        if (!result) {
          const teamId = (
            await prisma.team.findFirst({
              where: {
                matches: { some: { id: matchId } },
                participants: { some: { id: participantId } },
              },
            })
          )?.id
          await prisma.readyCheck
            .create({
              data: {
                match: { connect: { id: matchId } },
                participant: {
                  connect: {
                    id: participantId,
                  },
                },
                team: { connect: { id: teamId } },
                checkedInAt: new Date(),
                lobbyRole: isFirstCheckin ? 'creator' : 'joiner',
              },
              include: { match: true },
            })
            .then(async (readyCheck) => {
              const match = await prisma.match.findUnique({
                where: { id: readyCheck.match?.id },
              })
              await pubsub.publish(
                Match.$name,
                readyCheck.match?.id,
                'createReadyCheck',
                match ?? undefined
              )
              result = readyCheck
            })
        }

        const participants = await prisma.participant.findMany({
          where: { team: { matches: { some: { id: matchId } } } },
          include: { readyChecks: true },
        })

        const allCheckinsDone = participants.every((participant) =>
          participant.readyChecks.find(
            (readyCheck) => readyCheck.matchId === matchId
          )
        )

        if (allCheckinsDone) {
          await prisma.match.update({
            where: { id: matchId },
            data: { status: MatchStatus.PREP_PHASE },
          })
        }

        return result
      },
    })
  },
})
