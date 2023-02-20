import { objectType } from 'nexus'
import { GameMode } from 'nexus-prisma'
export const GameModeType = objectType({
  name: GameMode.$name,
  definition(t) {
    t.field(GameMode.id)
    t.field(GameMode.name)
    t.field(GameMode.teamSize)
  },
})
