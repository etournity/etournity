import { GameMode } from '.prisma/client'
import { Except } from 'type-fest'

const gameModes: GameMode[] = [
  {
    id: '1',
    name: '1v1',
    teamSize: 1,
  },
]

export default gameModes
