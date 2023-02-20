import { objectType } from 'nexus'
import { Stage } from 'nexus-prisma'

export const StageType = objectType({
  name: 'Stage',
  definition(t) {
    t.field(Stage.id)
    t.field(Stage.rounds)
    t.field(Stage.title)
    t.field(Stage.tournament)
    t.field(Stage.tournamentId)
    t.field(Stage.type)
    t.field(Stage.number)
  },
})
