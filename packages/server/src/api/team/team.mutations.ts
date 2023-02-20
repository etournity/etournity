import {
  extendType,
  FieldResolver,
  idArg,
  intArg,
  stringArg,
  list,
  nonNull,
} from 'nexus'
import { Team } from 'nexus-prisma'

export const TeamMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTeam', {
      type: Team.$name,

      args: {
        name: nonNull(stringArg()),
        participantIds: list(nonNull(idArg())),
        tournamentId: nonNull(idArg()),
      },
      resolve: createTeamResolver,
    })
    t.field('updateSeed', {
      type: Team.$name,
      args: {
        teamId: nonNull(idArg()),
        seed: nonNull(intArg()),
      },
      resolve: async (_, { teamId, seed }, { prisma, pubsub }) => {
        const team = await prisma.team.update({
          where: { id: teamId },
          data: { seed },
        })
        await pubsub.publish(Team.$name, team?.id, 'updateSeed')
        return team
      },
    })
  },
})

const createTeamResolver: FieldResolver<'Mutation', 'createTeam'> = async (
  _,
  { name, participantIds, tournamentId },
  { prisma }
) => {
  if ((participantIds?.length ?? 0) < 1)
    throw new Error('participantIds need to be specified')

  const team = prisma.team.create({
    data: {
      name,
      tournament: { connect: { id: tournamentId } },
      participants: {
        connect: participantIds?.map((participantId: string) => ({
          id: participantId ?? undefined,
        })),
      },
    },
  })

  return team
}
