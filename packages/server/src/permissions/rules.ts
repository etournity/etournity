import { rule, and, or } from 'graphql-shield'
import { hasPermissions as hasPermissionsRBAC } from '@etournity/rbac'
import { Rule } from 'graphql-shield/dist/rules'
import { ParticipantRoleType } from '@prisma/client'
import { Context } from '../context'

export const isAuthenticated = rule({
  cache: 'contextual',
})(async (_, __, ctx: Context) =>
  ctx.user ? true : 'No user found! Log in to get access.'
)

export const hasPermissions = (...permissions: string[] | string[][]): Rule =>
  rule({ cache: 'contextual' })(async (_, __, ctx: Context) =>
    hasPermissionsRBAC(ctx.user, ...permissions)
      ? true
      : `User does not have permission(s) ${permissions}`
  )

/**
 * Returns true if current user is specified user.
 * @param pathToUserId - Note: Omit parent object
 *
 * @example
 * ```ts
 * const parentObj = {
 *   id: '1234',
 *   userId: '5678',
 *   some: 'thing'
 * }
 *
 * permissions: shield({
 *   parentObj: {
 *     'some': rules.isUser('userId')
 *   }
 * })
 *
 * ```
 */
export const isUser = (pathToUserId?: string) =>
  and(
    isAuthenticated,
    rule({ cache: 'strict' })(async (parent, _, ctx: Context) => {
      const userId = () => {
        if (!pathToUserId) {
          if (!parent) return ctx.user.id
          return parent.id
        }

        for (
          let i = 0, path = pathToUserId.split('.'), len = path.length;
          i < len;
          i++
        ) {
          parent = parent[path[i]]
        }

        return parent
      }

      return ctx.user?.id === userId()
        ? true
        : 'User does not have access to this user data'
    })
  )

export const hasTournamentRoles = (
  roles: ParticipantRoleType[],
  pathToTournamentId?: string
) =>
  and(
    isAuthenticated,
    or(
      rule({ cache: 'strict' })(async (parent, args, ctx: Context) => {
        const getTournamentIdFromArgs = async (): Promise<
          string | undefined
        > => {
          if (args?.tournamentId) return args.tournamentId
          if (args.data?.[0]) args = { ...args.data?.[0] }
          if (args.data) args = args.data

          const {
            stageId,
            roundId,
            matchId,
            ticketId,
            participantId,
            matchGameId,
          } = args
          const tournament = await ctx.prisma.tournament.findFirst({
            where: {
              OR: [
                stageId && { stages: { some: { id: stageId } } },
                roundId && {
                  stages: { some: { rounds: { some: { id: roundId } } } },
                },
                matchId && {
                  stages: {
                    some: {
                      rounds: { some: { matches: { some: { id: matchId } } } },
                    },
                  },
                },
                matchGameId && {
                  stages: {
                    some: {
                      rounds: {
                        some: {
                          matches: {
                            some: {
                              matchGames: {
                                some: { id: matchGameId },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                ticketId && { tickets: { some: { id: ticketId } } },
                participantId && {
                  participants: { some: { id: participantId } },
                },
              ],
            },
            select: { id: true },
          })

          return tournament?.id
        }

        const tournamentId = async (): Promise<string> => {
          if (pathToTournamentId) {
            for (
              let i = 0,
                path = pathToTournamentId.split('.'),
                len = path.length;
              i < len;
              i++
            ) {
              parent = parent[path[i]]
            }

            return parent
          }

          const tournamentId = parent?.id ?? (await getTournamentIdFromArgs())

          if (!tournamentId) throw new Error('No tournamentId found')

          return tournamentId
        }

        try {
          const tournament = await ctx.prisma.tournament.findUnique({
            where: { id: await tournamentId() },
            select: {
              participants: {
                select: { roles: true },
                where: { userId: ctx.user.id },
              },
            },
          })

          if (!tournament)
            return `Unable to find tournament with id: ${await tournamentId()}`

          if (!tournament.participants?.[0])
            return 'User does not have a participant in this tournament.'

          if (
            tournament.participants?.[0]?.roles.some((participantRole) =>
              roles.includes(participantRole.type)
            )
          )
            return true
        } catch (e: unknown) {
          return `Error while evalutating hasTournamentRoles rule: ${e}`
        }

        return `User does not have one of the required tournament roles: ${roles.join(
          ', '
        )}`
      }),
      isOwnParticipant
    )
  )

export const isOwnParticipant = rule({ cache: 'contextual' })(
  async (parent, args, ctx: Context) => {
    const participantId = args?.participantId ?? parent?.participantId

    const userParticipants = await ctx.prisma.participant.findMany({
      where: { userId: ctx.user.id },
    })

    if (
      participantId &&
      userParticipants.some((participant) => participant.id === participantId)
    )
      return true

    return `Participant with the id: ${participantId} does not belong to user with id ${ctx.user.id}.`
  }
)

export const isDevEnvironment = () =>
  and(
    isAuthenticated,
    rule({ cache: 'strict' })(() =>
      process.env.ETY_ENV === 'develop' || process.env.ETY_ENV === 'local'
        ? true
        : 'This command can only be used in a dev or local environment.'
    )
  )
