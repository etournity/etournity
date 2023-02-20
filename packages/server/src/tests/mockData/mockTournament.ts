import { Tournament, TournamentStatus } from '@prisma/client'
import dayjs from 'dayjs'

export const mockTournament: Tournament = {
  id: 'tournament1',
  title: 'Test Tournament',
  createdAt: dayjs().toDate(),
  date: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
  publishedAt: dayjs().toDate(),
  checkinEnd: dayjs().toDate(),
  checkinStart: dayjs().toDate(),
  noShow: 10,
  description: 'Test Description',
  rules: 'Test Rules',
  discordLink: 'https://discord.gg/test',
  supportLink: 'https://discord.gg/test',
  streamLink: 'https://twitch.tv/test',
  gameId: 'game1',
  gameModeId: 'gameMode1',
  languageCode: 'lang1',
  regionCode: 'region1',
  status: TournamentStatus.PUBLISHED,
  maxPlayers: 16,
  prizePool: 'prize',
}
