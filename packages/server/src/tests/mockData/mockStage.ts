import { Stage } from '@prisma/client'
import { mockTournament } from './mockTournament'

export const mockStage: Stage = {
  id: 'stage1',
  mode: 1,
  number: 1,
  title: 'Test Stage',
  type: 'SINGLE',
  tournamentId: mockTournament.id,
}
