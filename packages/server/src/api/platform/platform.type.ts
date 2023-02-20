import { objectType } from 'nexus'
import { Platform } from 'nexus-prisma'

export const PlatformType = objectType({
  name: 'Platform',
  definition(t) {
    t.field(Platform.code)
    t.field(Platform.name)
  },
})
