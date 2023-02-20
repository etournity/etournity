import { extendType, nonNull, stringArg } from 'nexus'
import dayjs from 'dayjs'
import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'

const execPromise = util.promisify(exec)

export const SavestateMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSavestate', {
      type: 'String',

      description: 'Create a copy of the entire database',
      args: {
        title: stringArg(),
      },
      resolve: async (_, { title }) => {
        await execPromise('mkdir -p saves')

        const { stdout, stderr } = await execPromise(
          `PGPASSWORD=etournity pg_dump etournity > saves/save_${
            title !== '' && title !== undefined
              ? title
              : dayjs().format('DD.MM.YYYY_HH:mm:ss').toString()
          }.sql -h localhost -U etournity`
        )

        return stdout + stderr
      },
    })
    t.field('restoreSavestate', {
      type: 'String',

      description: 'Restore a database copy',
      args: {
        title: nonNull(stringArg()),
      },
      resolve: async (_, { title }, { prisma }) => {
        await execPromise(
          `PGPASSWORD=etournity psql -d etournity -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public" -h localhost -U etournity`
        )

        await prisma.$disconnect()
        await prisma.$connect()

        const { stdout, stderr } = await execPromise(
          `PGPASSWORD=etournity psql etournity < saves/save_${title}.sql -h localhost -U etournity`
        )

        return stdout + stderr
      },
    })
    t.field('deleteSavestate', {
      type: 'Boolean',

      description: 'Delete a database copy',
      args: {
        title: nonNull(stringArg()),
      },
      resolve: async (_, { title }) => {
        try {
          fs.unlinkSync(`saves/save_${title}.sql`)
        } catch {
          return false
        }

        return true
      },
    })
  },
})
