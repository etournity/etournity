import { Match } from '.prisma/client'
import { mockRound } from './mockRound'

export const mockMatch: Match = {
  id: 'match1',
  number: 1,
  status: 'SCHEDULED',
  gameLobbyCode: null,
  inGame: [],
  noShowTimer: null,
  roundId: mockRound.id,
}
