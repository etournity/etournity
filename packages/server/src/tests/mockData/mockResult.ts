import { Result } from '.prisma/client'

export const mockResult: Result = {
  id: 'result1',
  score: 1,
  matchGameId: 'matchGame1',
  teamId: 'team1',
  submissionId: 'submission1',
}
/**
 * A function to mock realistic results for a customizable amount of matchGames.
 *
 * Since each each team needs to have a result for each submission and each team should have a submission for each matchGame,
 * the total amount of results is: matchGameAmount * uniqueTeams ** 2 .
 *
 * @example ```
 * const results = getMockedMatchGameResults(2, ['team1', 'team2'])
 * console.log(results.length) // Result: 8
 * ```
 *
 * @param matchGameAmount specifies the number of matchGames to mock
 * @param teamIds string[] - a list of teamIds
 * @param winners string[] - a list of teamIds to specify the winner for each matchGame
 * @param filterByMatchGame boolean - whether to filter the results by matchGameId
 * @returns an Array of Results
 */
export const getMockedResults = ({
  matchGameAmount,
  winners,
  teamIds,
  filterbyMatchGame,
}: {
  matchGameAmount: number
  winners: string[]
  teamIds: string[]
  filterbyMatchGame: boolean
}): Result[] => {
  const teamsAmount = teamIds.length
  const resultsPerMatchGame = teamsAmount ** 2
  const resultsAmount = matchGameAmount * resultsPerMatchGame

  const results = Array(resultsAmount)
    .fill(null)
    .flatMap((_, index) => {
      const currentTeamId = teamIds[index % teamIds.length]
      const matchGameIndex = Math.floor(index / resultsPerMatchGame)
      return {
        id: `result${index + 1}`,
        matchGameId:
          Math.floor(index / teamsAmount) % teamsAmount === 0
            ? `matchGame${matchGameIndex + 1}`
            : null,
        submissionId: `submission${Math.floor(index / teamsAmount) + 1}`,
        score: currentTeamId === winners[matchGameIndex] ? 1 : 0,
        teamId: currentTeamId,
      }
    })

  return filterbyMatchGame
    ? results.filter(({ matchGameId }) => matchGameId !== null)
    : results
}
