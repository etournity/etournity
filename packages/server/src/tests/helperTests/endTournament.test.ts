import { endTournament } from '../../helpers/endTournament'
import { Context, MockContext, createMockContext } from '../../context'
import { mockTournament } from '../mockData/mockTournament'
import { TournamentStatus, RoundStatus } from '@prisma/client'
import { mockStage } from '../mockData/mockStage'
import { mockRound } from '../mockData/mockRound'
import { mockTicket } from '../mockData/mockTicket'
import { Document } from 'yaml'

const tournament = {
  ...mockTournament,
  status: TournamentStatus.STARTED,
  stages: [
    {
      ...mockStage,
      rounds: [mockRound],
    },
  ],
  tickets: [mockTicket],
}
const completedTournament = {
  ...tournament,
  stages: [
    {
      ...mockStage,
      rounds: [{ ...mockRound, status: RoundStatus.COMPLETED }],
    },
  ],
  tickets: [],
}
const finishedTournament = {
  ...tournament,
  status: TournamentStatus.FINISHED,
}

let ctx: Context
let mockCtx: MockContext

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})

test('should set tournament status to FINISHED when all rounds are finished and tickets are closed', async () => {
  mockCtx.prisma.tournament.findFirst.mockResolvedValue(completedTournament)

  mockCtx.prisma.tournament.update.mockResolvedValue(finishedTournament)

  await expect(endTournament(ctx, tournament.id)).resolves.toEqual(
    finishedTournament
  )
})

test('should return null if not all rounds are finished', async () => {
  mockCtx.prisma.tournament.findFirst.mockResolvedValue({ ...tournament })

  mockCtx.prisma.tournament.update.mockResolvedValue(finishedTournament)

  await expect(endTournament(ctx, tournament.id)).resolves.toEqual(null)
})

test('should return null if not all tickets are closed', async () => {
  mockCtx.prisma.tournament.findFirst.mockResolvedValue({
    ...tournament,
  })

  mockCtx.prisma.tournament.update.mockResolvedValue(finishedTournament)

  await expect(endTournament(ctx, tournament.id)).resolves.toEqual(null)
})
