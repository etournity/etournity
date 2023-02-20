import { Prisma, GameStatus, MatchStatus } from '@prisma/client'
import { progressMatchWinner } from './progressMatchWinner'
import { endRound } from './endRound'
import { Context } from '../context'

export const setMatchWinner = async (
  ctx: Context,
  matchId: string,
  winnerId?: string
) => {
  const { prisma, pubsub } = ctx
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      opponents: {
        include: {
          participants: true,
          readyChecks: { where: { matchId } },
          submissions: { where: { matchGame: { matchId } } },
        },
      },
      round: true,
      matchGames: true,
    },
  })

  if (!match) throw new Error(`Can't find match with id ${matchId}.`)

  const getScore = (
    winnerId: string | undefined,
    opponentId: string,
    teamCheckedIn: boolean
  ) => {
    if (winnerId) {
      if (winnerId === opponentId) return 1
      return 0
    }

    // If one team hasn't checked in, the other team wins
    if (teamCheckedIn) return 1
    return 0
  }

  // Result template for one game
  const resultCreateInputs:
    | Prisma.ResultCreateInput[]
    | undefined = match.opponents?.map((opponent) => {
    const teamCheckedIn =
      opponent.readyChecks.length === opponent.participants.length

    return {
      team: { connect: { id: opponent.id } },
      score: getScore(winnerId, opponent.id, teamCheckedIn),
    }
  })

  const winnerSubmissions =
    match.opponents?.find((opponent) => opponent.id === winnerId)
      ?.submissions ?? []

  // Reset previously set results.
  await prisma.result.updateMany({
    where: { matchGame: { matchId } },
    data: { matchGameId: null },
  })

  // Run on resolving Ticket (type ScoreSubmissionIssue)
  if (winnerSubmissions.length > 0) {
    await Promise.all(
      winnerSubmissions.map((submission) =>
        prisma.submission.update({
          where: { id: submission.id },
          data: {
            results: {
              updateMany: {
                where: { submissionId: submission.id },
                data: { matchGameId: submission.matchGameId },
              },
            },
            matchGame: { update: { status: GameStatus.MANUAL_EDIT } },
          },
        })
      )
    )
  } else {
    const minWinningScore = Math.ceil((match.round?.format ?? 1) / 2)
    // Run on NO_SHOW, BYE or on kickParticipant (no matchGames created yet)
    if ((match.matchGames.length ?? 0) === 0) {
      await Promise.all(
        Array(minWinningScore)
          .fill(null)
          .map((_, i) =>
            prisma.matchGame.create({
              data: {
                number: i + 1,
                status: GameStatus.MANUAL_EDIT,
                result: { create: resultCreateInputs },
                match: { connect: { id: match.id } },
              },
            })
          )
      )
      // Run on kickParticipant (matchGames already created)
    } else {
      await Promise.all(
        match.matchGames.map((matchGame) => {
          if (matchGame.number <= minWinningScore) {
            return prisma.matchGame.update({
              where: { id: matchGame.id },
              data: {
                status: GameStatus.MANUAL_EDIT,
                result: { create: resultCreateInputs },
              },
            })
          }

          return null
        })
      )
    }
  }

  const returnMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      status: winnerId ? MatchStatus.DONE : MatchStatus.NO_SHOW,
    },
  })

  await progressMatchWinner(prisma, matchId, winnerId)
  await endRound(ctx, undefined, matchId)
  await pubsub.publish('Match', returnMatch.id, 'setMatchWinner', returnMatch)
  return returnMatch
}
