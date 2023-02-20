import { MatchStatus, ParticipantRoleType } from '@prisma/client'
import { Context } from '../context'
import { setMatchWinner } from './setMatchWinner'

export const kickParticipant = async (ctx: Context, participantId: string) => {
  const { prisma, pubsub } = ctx
  const participant = await prisma.participant.update({
    where: { id: participantId },
    data: {
      kicked: true,
      roles: { deleteMany: { type: ParticipantRoleType.PLAYER } },
    },
    include: {
      team: {
        select: {
          matches: {
            where: {
              status: {
                notIn: [
                  MatchStatus.SCHEDULED,
                  MatchStatus.DONE,
                  MatchStatus.NO_SHOW,
                ],
              },
            },
            include: { opponents: true },
          },
        },
      },
    },
  })

  if (!participant) throw Error('Participant not found')
  // Update match if participant has active match.
  if (participant.team?.matches[0] !== undefined) {
    const matchOpponent = participant.team.matches[0].opponents?.find(
      ({ id }) => id !== participant.teamId
    )

    if (!matchOpponent?.id)
      throw Error(
        `Can't set winner. No other teams in match ${participant.team?.matches[0].id}.`
      )
    await setMatchWinner(ctx, participant.team.matches[0].id, matchOpponent.id)
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: participant.tournamentId ?? '' },
    include: { participants: true },
  })
  await pubsub.publish(
    'Tournament',
    participant.tournamentId,
    'kickParticipant',
    {
      ...tournament,
      participants: tournament?.participants.map((p) =>
        p.id === participant.id ? participant : p
      ),
    }
  )
  return participant
}
