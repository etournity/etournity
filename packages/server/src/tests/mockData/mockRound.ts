import { Round } from '@prisma/client'
import { mockStage } from './mockStage'

export const mockRound: Round = {
  id: 'round1',
  title: 'Test Round',
  status: 'UPCOMING',
  format: 3,
  locked: false,
  number: 1,
  stageId: mockStage.id,
}
