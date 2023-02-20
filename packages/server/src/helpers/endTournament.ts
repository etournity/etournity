import { RoundStatus, TournamentStatus } from '@prisma/client'
import { Tournament } from 'nexus-prisma'
import { Context } from '../context'
import { mixpanel } from '../globals'

export const endTournament = async (
  ctx: Context,
  tournamentId?: string,
  roundId?: string
) => {
  const { prisma, pubsub, user } = ctx
  const tournament = await prisma.tournament.findFirst({
    where: {
      id: tournamentId,
      stages: roundId
        ? { some: { rounds: { some: { id: roundId } } } }
        : undefined,
    },
    include: { stages: { select: { rounds: true } }, tickets: true },
  })

  if (!tournament) throw Error(`No tournament with id: ${tournamentId} found.`)

  const allRoundsCompleted = tournament.stages[0].rounds.every(
    (round) => round.status === RoundStatus.COMPLETED
  )
  const noOpenTickets = tournament.tickets.every((ticket) => ticket.resolved)

  if (!allRoundsCompleted || !noOpenTickets) return null

  const retournament = await prisma.tournament
    .update({
      where: { id: tournament.id },
      data: { status: TournamentStatus.FINISHED },
    })
    .then((tournament) => {
      mixpanel.track('Tournament Finished', {
        distinct_id: user.id,
        tournamentId: tournament.id,
      })
      return tournament
    })
  await pubsub.publish(
    Tournament.$name,
    retournament.id,
    'endTournament',
    retournament,
    true
  )
  return retournament
}
