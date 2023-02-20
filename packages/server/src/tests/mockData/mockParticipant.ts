import { Participant } from '@prisma/client'
import { mockTournament } from './mockTournament'

export const mockParticipant: Participant = {
  id: 'participant1',
  kicked: false,
  requestingMod: false,
  deniedMod: false,
  tournamentId: mockTournament.id,
  teamId: null,
  userId: 'user1',
  registeredAt: new Date(),
  checkedInAt: null,
}
