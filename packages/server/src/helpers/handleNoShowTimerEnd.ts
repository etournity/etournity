import { MatchStatus } from '@prisma/client'
import { Match } from 'nexus-prisma'
import { Context } from '../context'
import { Logger } from '../logger'
import { setMatchWinner } from './setMatchWinner'
import { closeMatchTickets } from './closeMatchTickets'

const logger = new Logger('noShow')

export const handleNoShowTimerEnd = async (ctx: Context, matchId: string) => {
  const { prisma, pubsub } = ctx
  const readyChecks = await prisma.readyCheck.count({ where: { matchId } })
  const partipantCount = await prisma.participant.count({
    where: { team: { matches: { some: { id: matchId } } } },
  })

  const matchStatus = (
    await prisma.match.findUnique({ where: { id: matchId } })
  )?.status
  const allReady = readyChecks === partipantCount

  if (allReady || matchStatus === MatchStatus.DONE) return null

  logger.debug(`NoShow at match ${matchId}`)

  const match = await setMatchWinner(ctx, matchId)

  await closeMatchTickets(ctx, matchId)

  await pubsub.publish(Match.$name, match.id, 'noShow', match)
}
