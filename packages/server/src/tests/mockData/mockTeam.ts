import { Team } from '@prisma/client'
import { mockParticipant } from './mockParticipant'
import { mockTournament } from './mockTournament'

export const mockTeam: Team = {
  id: 'team1',
  seed: 1,
  name: 'Team 1',
  tournamentId: mockTournament.id,
  avatar: null,
  leaderId: null,
}

export const getTeams = (teamAmount: number): Team[] =>
  Array(teamAmount)
    .fill(null)
    .map((_, i) => ({
      id: `team${i + 1}`,
      name: `Team ${i + 1}`,
      seed: i + 1,
      tournamentId: mockTournament.id,
      avatar: null,
      leaderId: `participant${i * 2 + 1}`,
      participants: Array(2)
        .fill(null)
        .map((_, j) => ({
          ...mockParticipant,
          id: `participant${i * 2 + j + 1}`,
          teamId: `team${i + 1}`,
          userId: `user${i * 2 + j + 1}`,
        })),
    }))
