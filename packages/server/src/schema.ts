import { applyMiddleware } from 'graphql-middleware'
import { declarativeWrappingPlugin, makeSchema } from 'nexus'
import NexusPrismaScalars from 'nexus-prisma/scalars'
import { join } from 'path'
import { types } from './api'
import { permissions } from './permissions'
import { mutationYupValidationSchemaMap, yupValidation } from './yup'

export const schema = applyMiddleware(
  makeSchema({
    types: [NexusPrismaScalars, ...types],
    shouldExitAfterGenerateArtifacts: process.argv.includes('--nexus-exit'),
    outputs: {
      typegen: join(process.cwd(), './src/generated/nexus.d.ts'),
      schema: join(process.cwd(), './src/generated/schema.graphql'),
    },
    plugins: [declarativeWrappingPlugin()],
    contextType: {
      module: join(process.cwd(), './src/context.ts'),
      export: 'Context',
    },
    sourceTypes: {
      modules: [
        {
          module: '@prisma/client',
          alias: 'prisma',
        },
      ],
    },
  }),
  permissions,
  yupValidation(mutationYupValidationSchemaMap)
)
