import { extendType } from 'nexus'
import fs from 'fs'

export const SavestateQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.string('savestates', {
      resolve: async () => {
        if (process.env.ETY_ENV !== 'local')
          throw Error("Can't load savestates outside of local")

        const files = fs
          .readdirSync('saves')
          .map((title) => title.substring(5, title.length - 9))

        return files
      },
    })
  },
})
