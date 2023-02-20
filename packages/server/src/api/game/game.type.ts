import { objectType } from 'nexus'
import { Game } from 'nexus-prisma'

export const GameType = objectType({
  name: Game.$name,
  definition(t) {
    t.field(Game.id)
    t.field(Game.title)
    t.field(Game.image)
    t.field(Game.homepage)
    t.field(Game.supported)
    t.field(Game.verified)
    t.field(Game.tournaments)
    t.field(Game.gameUsers)
  },
})
