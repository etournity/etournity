import { Prisma, PrismaClient, Result } from '@prisma/client'

export const progressMatchWinner = async (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
  matchId: string,
  winnerTeamId?: string
) => {
  const results = await prisma.result.findMany({
    where: { matchGame: { matchId } },
  })

  const stage = await prisma.stage.findFirst({
    where: { rounds: { some: { matches: { some: { id: matchId } } } } },
    select: {
      rounds: {
        select: {
          id: true,
          number: true,
          format: true,
          matches: {
            select: {
              id: true,
              number: true,
              opponents: {
                select: { id: true },
              },
              readyChecks: { select: { id: true } },
            },
            orderBy: { number: 'asc' },
          },
        },
      },
    },
  })

  if (!stage) throw Error(`Could not find stage for matchId: ${matchId}!`)

  const currentRound = stage.rounds.find(({ matches }) =>
    matches.some(({ id }) => id === matchId)
  )
  if (!currentRound) throw Error("Can't find current round.")

  const currentMatchIndex = currentRound.matches.findIndex(
    ({ id }) => id === matchId
  )

  const currentMatch = currentRound.matches.find(({ id }) => id === matchId)
  if (!currentMatch)
    throw Error(`Could not find match ${matchId} in round ${currentRound.id}`)

  const nextRound = stage.rounds.find(
    (round) => round.number === currentRound.number + 1
  )

  // No round to progress to
  if (!nextRound) return null

  // We can determine the next match in the hirarchy by flooring the halved index of the current match and inserting it in the next round.
  // Example: Round 1 => 8 matches. Match 3 (Round 1 [2]) and Match 4 (Round 1 [3]) should lead to Match 10 (Round 2 [1] )
  // Match 3 => index 2, Match 4 => index 3. Math.floor(2/2) = 1, Math.floor(3/2) = index 1 ==> Match 10 (Round 2 [1])
  const nextMatch = nextRound.matches[Math.floor(currentMatchIndex / 2)]

  if (!nextMatch)
    throw Error(`Can't find match for Round ${nextRound.number} .`)

  if (!winnerTeamId) {
    winnerTeamId = getWinnerFromResults(
      currentRound.format ?? 1,
      results,
      currentMatch.opponents.map(({ id }) => id) ?? []
    )
  }

  const bothNoShow = currentMatch.readyChecks.length === 0

  if (!winnerTeamId && !bothNoShow)
    throw Error('No winner to put forward found.')

  if (nextMatch.opponents.some(({ id }) => id === winnerTeamId))
    throw new Error('Winning Team already inside of next match.')

  return prisma.match.update({
    where: { id: nextMatch.id },
    data: {
      opponents: winnerTeamId
        ? {
            connect: {
              id: winnerTeamId,
            },
          }
        : undefined,
    },
  })
}

export const getWinnerFromResults = (
  format: number,
  results: Result[],
  opponentIds: string[]
): string | undefined => {
  const getScore = (teamId: string) => {
    const scores = results.map((result) =>
      result.teamId === teamId ? result.score : 0
    )

    if (!scores.length) return 0
    return scores.reduce((c, v) => c + v)
  }

  // Assign total scores to team
  const mappedScores: Array<{
    teamId: string
    score: number
  }> = opponentIds.map((id) => ({
    teamId: id,
    score: getScore(id),
  }))
  // Sort teams by score. First in Array is winnerTeam (if score is higher than minWinningScore)
  const winnerTeam = [...mappedScores].sort((a, b) => b.score - a.score)[0]
  if (mappedScores[0].score === mappedScores[1].score)
    throw Error('Both teams have the same score!')
  if (!winnerTeam) return undefined

  return winnerTeam.score >= Math.ceil(format / 2)
    ? winnerTeam.teamId
    : undefined
}
