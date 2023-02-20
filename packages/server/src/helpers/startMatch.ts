import { Match, MatchStatus, ParticipantRoleType } from '@prisma/client'
import dayjs from 'dayjs'
import { handleNoShowTimerEnd } from './handleNoShowTimerEnd'
import { setMatchWinner } from './setMatchWinner'
import { closeMatchTickets } from './closeMatchTickets'
import { Context } from '../context'
import { endRound } from './endRound'
import { pubsub, prisma } from '../globals'
import { noShowQueue } from '../queues/noShow.queue'

void noShowQueue.process(async (job, done) => {
  await handleNoShowTimerEnd(
    {
      user: job.data.user,
      prisma,
      pubsub,
    },
    job.data.matchId
  )
  done()
})

export const startMatch = async (
  ctx: Context,
  matchId: string
): Promise<Match | null> => {
  const { prisma, user } = ctx

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      opponents: {
        where: {
          participants: {
            every: { roles: { some: { type: ParticipantRoleType.PLAYER } } },
          },
        },
        select: { id: true },
      },
      round: {
        select: {
          stage: {
            select: {
              tournament: {
                select: {
                  noShow: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!match) throw Error('Match to start not found.')

  if ((match.opponents?.length ?? 0) < 2) {
    // This is a 'bye'. The team will advance to the next round.
    if ((match.opponents?.length ?? 0) === 1) {
      await setMatchWinner(ctx, matchId, match.opponents?.[0].id)
      await closeMatchTickets(ctx, matchId)

      return null
    }

    // No eligible teams in the match.
    await prisma.match.update({
      where: { id: matchId },
      data: { status: MatchStatus.DONE },
    })
    await closeMatchTickets(
      ctx,
      matchId,
      'Issue automatically dismissed. Not enough players to start match. Match closed.'
    )
    await endRound(ctx, undefined, matchId)
    return null
  }

  const noShowMinutes = match?.round?.stage?.tournament.noShow
  if (noShowMinutes === undefined) throw Error('No noShow timer provided.')

  const noShowTimerDate = dayjs().add(noShowMinutes, 'minutes').toDate()
  const noShowTimerMilliseconds = noShowMinutes * 60 * 1000

  const enableNoShowTimer = noShowMinutes !== 0

  return prisma.match
    .update({
      where: { id: matchId },
      data: {
        status: MatchStatus.STARTED,
        noShowTimer: enableNoShowTimer ? noShowTimerDate : undefined,
      },
    })
    .then(async (match) => {
      await noShowQueue.removeJobs(matchId)

      if (enableNoShowTimer)
        await noShowQueue.add(
          { user, matchId },
          { delay: noShowTimerMilliseconds, jobId: matchId }
        )

      return match
    })
}
