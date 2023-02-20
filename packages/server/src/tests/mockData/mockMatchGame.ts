import { MatchGame } from '.prisma/client'

export const mockMatchGame: MatchGame = {
  id: 'matchGame1',
  number: 1,
  status: 'WAITING',
  matchId: 'match1',
}
