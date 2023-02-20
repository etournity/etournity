import { objectType } from 'nexus'
import { Region } from 'nexus-prisma'

export const RegionType = objectType({
  name: 'Region',
  definition(t) {
    t.field(Region.code)
    t.field(Region.name)
  },
})
