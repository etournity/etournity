import { ReadyCheck } from '@prisma/client'
import { mockMatch } from './mockMatch'
import { mockParticipant } from './mockParticipant'
import { mockTeam } from './mockTeam'

export const mockReadyCheck: ReadyCheck = {
  id: 'readyCheck1',
  lobbyRole: 'creator',
  matchId: mockMatch.id,
  checkedInAt: new Date(),
  teamId: mockTeam.id,
  participantId: mockParticipant.id,
}
