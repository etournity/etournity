import { Prisma, PrismaClient, GameStatus } from '@prisma/client'
import { PubSubHandler } from './pubSubHelper'
import { compareScores } from './compareScores'
import { Match } from 'nexus-prisma'

export const setMatchGameStatus = async (
  matchGameId: string,
  status: GameStatus | null,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
  pubsub: PubSubHandler
) => {
  const matchGame = await prisma.matchGame.findUnique({
    where: { id: matchGameId },
    include: {
      submissions: true,
      match: { select: { id: true, opponents: true } },
    },
  })
  if (!matchGame)
    throw new Error('Couldn\'t find matchGame in "setMatchGameStatus"')

  const submissionsComplete =
    matchGame?.submissions.length === matchGame?.match.opponents.length

  if (!submissionsComplete) return matchGame

  let submissionStatus: GameStatus = (await compareScores({
    prisma,
    matchGameId,
  }))
    ? GameStatus.SUCCESS
    : GameStatus.CONFLICT

  if (
    matchGame?.submissions.every((submission) => submission.resubmitted) &&
    matchGame?.status === GameStatus.CONFLICT &&
    submissionStatus === GameStatus.CONFLICT
  ) {
    submissionStatus = GameStatus.MANUAL_EDIT
  }

  const returnMatchGame = await prisma.matchGame.update({
    where: { id: matchGameId },
    data: { status: status ?? submissionStatus },
  })
  const match = await prisma.match.findUnique({
    where: { id: matchGame?.match?.id },
    include: { matchGames: true },
  })

  await pubsub.publish(
    Match.$name,
    matchGame?.match?.id,
    'setMatchGameStatus',
    {
      ...match,
      matchGames: match?.matchGames.map((g) =>
        g.id === returnMatchGame.id ? returnMatchGame : g
      ),
    }
  )

  return returnMatchGame
}
