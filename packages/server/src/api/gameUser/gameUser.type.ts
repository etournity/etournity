import { objectType } from 'nexus'
import { GameUser } from 'nexus-prisma'

export const GameUserType = objectType({
  name: GameUser.$name,
  definition(t) {
    t.field(GameUser.id)
    t.field(GameUser.user)
    t.field(GameUser.game)
    t.field(GameUser.gameId)
    t.field(GameUser.inGameName)
    t.field(GameUser.elo)
  },
})
