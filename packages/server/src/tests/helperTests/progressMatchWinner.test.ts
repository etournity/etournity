import {
  progressMatchWinner,
  getWinnerFromResults,
} from '../../helpers/progressMatchWinner'
import { Context, MockContext, createMockContext } from '../../context'
import { getMockedResults } from '../mockData/mockResult'
import { mockStage } from '../mockData/mockStage'
import { mockRound } from '../mockData/mockRound'
import { mockMatch } from '../mockData/mockMatch'
import { getTeams } from '../mockData/mockTeam'
import { mockReadyCheck } from '../mockData/mockReadyCheck'

let ctx: Context
let mockCtx: MockContext

const teams = getTeams(2)

const getStage = (roundAmount: number, roundFormat: number) => ({
  ...mockStage,
  rounds: Array(roundAmount)
    .fill(null)
    .map((_, index) => ({
      ...mockRound,
      format: roundFormat,
      number: index + 1,
      matches: [
        {
          ...mockMatch,
          id: `match${index + 1}`,
          opponents: index === 0 ? teams : [],
          readyChecks: [{ ...mockReadyCheck, matchId: `match${index + 1}` }],
        },
      ],
    })),
})

describe('progressMatchWinner', () => {
  beforeEach(() => {
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test('should return null if there is no next round', async () => {
    mockCtx.prisma.stage.findFirst.mockResolvedValue(getStage(1, 1))

    mockCtx.prisma.result.findMany.mockResolvedValue(
      getMockedResults({
        matchGameAmount: 1,
        winners: ['team1'],
        teamIds: ['team1', 'team2'],
        filterbyMatchGame: true,
      })
    )
    return expect(
      progressMatchWinner(ctx.prisma, mockMatch.id, undefined)
    ).resolves.toEqual(null)
  })

  test('should advance winning team to their next match', async () => {
    const stage = getStage(2, 1)
    const expectedMatch = {
      ...stage.rounds[1].matches[0],
      opponents: [teams[0]],
    }
    mockCtx.prisma.stage.findFirst.mockResolvedValue(stage)

    mockCtx.prisma.result.findMany.mockResolvedValue(
      getMockedResults({
        matchGameAmount: 1,
        winners: ['team1'],
        teamIds: ['team1', 'team2'],
        filterbyMatchGame: true,
      })
    )
    mockCtx.prisma.match.update.mockResolvedValue(expectedMatch)
    return expect(
      progressMatchWinner(ctx.prisma, stage.rounds[0].matches[0].id, undefined)
    ).resolves.toEqual(expectedMatch)
  })
  test('should throw error if winning team already in next match', async () => {
    const baseStage = getStage(2, 1)
    const expectedMatch = {
      ...baseStage.rounds[1].matches[0],
      opponents: teams,
    }
    const stage = {
      ...baseStage,
      rounds: [
        baseStage.rounds[0],
        {
          ...baseStage.rounds[1],
          matches: [expectedMatch],
        },
      ],
    }

    mockCtx.prisma.stage.findFirst.mockResolvedValue(stage)

    mockCtx.prisma.result.findMany.mockResolvedValue(
      getMockedResults({
        matchGameAmount: 1,
        winners: ['team1'],
        teamIds: ['team1', 'team2'],
        filterbyMatchGame: true,
      })
    )
    mockCtx.prisma.match.update.mockResolvedValue(expectedMatch)
    return expect(
      progressMatchWinner(ctx.prisma, stage.rounds[0].matches[0].id, undefined)
    ).rejects.toThrowError('Winning Team already inside of next match.')
  })
})

describe('getWinnerFromResults', () => {
  test("should return 'undefined' if no winner exists", () => {
    const results = getMockedResults({
      matchGameAmount: 1,
      winners: ['team1'],
      teamIds: ['team1', 'team2'],
      filterbyMatchGame: true,
    })
    expect(getWinnerFromResults(3, results, ['team1', 'team2'])).toBeUndefined()
  })
  test('should return teamId if winner exists', () => {
    const results = getMockedResults({
      matchGameAmount: 3,
      winners: ['team1', 'team2', 'team1'],
      teamIds: ['team1', 'team2'],
      filterbyMatchGame: true,
    })
    expect(getWinnerFromResults(3, results, ['team1', 'team2'])).toEqual(
      'team1'
    )
  })
})
