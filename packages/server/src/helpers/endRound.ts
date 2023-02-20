import { MatchStatus, RoundStatus } from '@prisma/client'
import { endTournament } from './endTournament'
import { startRound } from './startRound'
import { Tournament } from 'nexus-prisma'
import { Context } from '../context'

export const endRound = async (
  ctx: Context,
  roundId?: string,
  matchId?: string
) => {
  const { prisma, pubsub } = ctx
  const round = await prisma.round.findFirst({
    where: roundId ? { id: roundId } : { matches: { some: { id: matchId } } },
    include: {
      matches: true,
      stage: { include: { rounds: true, tournament: true } },
    },
  })

  if (!round) throw Error(`No round with id: ${round} found.`)

  const completedStatus: MatchStatus[] = [MatchStatus.DONE, MatchStatus.NO_SHOW]

  if (round.matches.every((match) => completedStatus.includes(match.status))) {
    await prisma.round.update({
      where: { id: round.id },
      data: { status: RoundStatus.COMPLETED },
    })

    const nextRound = round.stage?.rounds.find(
      (nextRound) => nextRound.number === round.number + 1
    )
    if (nextRound) {
      await startRound(ctx, nextRound)
    } else {
      await endTournament(ctx, undefined, round.id)
    }
  }

  await pubsub.publish(Tournament.$name, round.stage?.tournamentId, 'endRound')
  return round
}
