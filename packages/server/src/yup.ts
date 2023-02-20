import { FieldResolver } from 'nexus'
import { Context } from './context'
import { ObjectSchema, Shape } from 'yup'
import { createTournamentSchema, createTicketSchema } from '@etournity/shared'

import { RootValueField } from 'nexus/dist/typegenTypeHelpers'
import { GraphQLResolveInfo } from 'graphql'

export const mutationYupValidationSchemaMap: YupValidation = {
  createTicket: createTicketSchema.server,
  createTournament: createTournamentSchema.server,
}

export type YupValidation = Record<
  string,
  ObjectSchema<Shape<Record<string, unknown>, any>> | null
>

export const yupValidation = (validationSchemaMap: YupValidation) => async (
  resolve: FieldResolver<'Mutation', any>,
  _: RootValueField<'Mutation', ''>,
  args: Record<string, unknown>,
  ctx: Context,
  info: GraphQLResolveInfo
) => {
  const validationSchema = validationSchemaMap[info.fieldName]
  if (validationSchema) await validationSchema.validate(args)

  return resolve(_, args, ctx, info)
}
