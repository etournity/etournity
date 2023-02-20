import { RoundStatus, TournamentStatus } from '@prisma/client'
import { arg, booleanArg, extendType, idArg, nonNull } from 'nexus'
import { Round, Tournament } from 'nexus-prisma'
import { endRound } from '../../helpers/endRound'

export const RoundMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('setRoundStatus', {
      type: Round.$name,
      args: {
        roundId: nonNull(idArg()),
        status: arg({ type: 'RoundStatus' }),
        locked: booleanArg(),
      },
      resolve: async (
        _,
        { roundId, status, locked },
        { prisma, pubsub, user }
      ) => {
        let round = await prisma.round.findUnique({
          where: { id: roundId },
          include: {
            stage: {
              select: { tournament: { select: { id: true, status: true } } },
            },
          },
        })

        if (!round) throw new Error('Round not found')

        if (round?.status !== RoundStatus.UPCOMING && round.locked) {
          throw new Error("Round doesn't exist or isn't upcoming")
        }

        round = await prisma.round.update({
          where: { id: roundId },
          data: { status: status ?? undefined, locked: locked ?? undefined },
          include: {
            stage: {
              select: { tournament: { select: { id: true, status: true } } },
            },
          },
        })

        const tournamentStarted: TournamentStatus[] = [
          TournamentStatus.STARTED,
          TournamentStatus.ERROR,
        ]
        if (
          round.stage?.tournament &&
          tournamentStarted.includes(round.stage.tournament.status)
        ) {
          const previousRound = await prisma.round.findFirst({
            where: { number: round.number - 1, stageId: round.stageId },
            select: { id: true },
          })

          if (round.status === RoundStatus.COMPLETED) {
            await endRound({ prisma, pubsub, user }, round.id)
          }

          if (previousRound && locked === false) {
            await endRound({ prisma, pubsub, user }, previousRound.id)
          }
        }

        const tournament = await prisma.tournament.findUnique({
          where: { id: round?.stage?.tournament.id },
          include: { stages: { include: { rounds: true } } },
        })
        await pubsub.publish(
          Tournament.$name,
          round.stage?.tournament?.id,
          'setRoundStatus',
          tournament ?? undefined
        )
        return round
      },
    })
  },
})
