import { MatchStatus, RoundStatus, Round } from '@prisma/client'
import { Tournament } from 'nexus-prisma'
import { Context } from '../context'
import { startMatch } from './startMatch'

export const startRound = async (ctx: Context, nextRound: Round) => {
  if (nextRound?.locked) return null

  const { prisma, pubsub } = ctx
  const round = await prisma.round.update({
    where: { id: nextRound.id },
    data: {
      status: RoundStatus.ACTIVE,
    },
    include: {
      matches: {
        where: { status: MatchStatus.SCHEDULED },
        select: { id: true },
      },
      stage: { select: { tournament: true, rounds: true } },
    },
  })

  if (!round) throw Error(`No round with id: ${nextRound.id} found.`)

  // This should be concurrently or offloaded at some point.
  if (round.matches.length > 0)
    await Promise.all(round.matches.map((match) => startMatch(ctx, match.id)))

  await pubsub.publish(
    Tournament.$name,
    round.stage?.tournament?.id,
    'startRound',
    {
      ...round.stage?.tournament,
      stages: {
        ...round.stage,
        rounds: round.stage?.rounds.map((r) => (r.id === round.id ? round : r)),
      },
    },
    true
  )
  return round
}
