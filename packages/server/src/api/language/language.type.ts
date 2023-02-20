import { objectType } from 'nexus'
import { Language } from 'nexus-prisma'
export const LanguageType = objectType({
  name: Language.$name,
  definition(t) {
    t.field(Language.code)
    t.field(Language.name)
  },
})
