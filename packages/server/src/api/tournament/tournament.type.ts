import { objectType } from 'nexus'
import {
  PrismaClient,
  RoundStatus,
  ParticipantRoleType,
  Team,
  MatchStatus,
} from '@prisma/client'
import { ApolloError } from 'apollo-server-express'
import { Tournament } from 'nexus-prisma'

export const TournamentType = objectType({
  name: Tournament.$name,
  definition(t) {
    t.field(Tournament.id)
    t.field(Tournament.title)
    t.field(Tournament.description)
    t.field(Tournament.participants)
    t.field(Tournament.date)
    t.field(Tournament.discordLink)
    t.field(Tournament.supportLink)
    t.field(Tournament.streamLink)
    t.field(Tournament.prizePool)
    t.field(Tournament.region)
    t.field(Tournament.platforms)
    t.field(Tournament.rules)
    t.field(Tournament.checkinStart)
    t.field(Tournament.checkinEnd)
    t.field(Tournament.noShow)
    t.field(Tournament.createdAt)
    t.field(Tournament.updatedAt)
    t.field(Tournament.maxPlayers)
    t.field(Tournament.game)
    t.field(Tournament.gameId)
    t.field(Tournament.gameMode)
    t.field(Tournament.gameModeId)
    t.field(Tournament.participants)
    t.field(Tournament.stages)
    t.field(Tournament.status)
    t.field(Tournament.tickets)
    t.field(Tournament.language)
    t.field(Tournament.publishedAt)
    t.field(Tournament.chatRoom)
    t.field('gameUser', {
      type: 'GameUser',

      resolve: async (tournament, _, { prisma, user }) =>
        prisma.gameUser.findUnique({
          where: {
            GameUser_userId_gameId_key: {
              userId: user.id,
              gameId: tournament.gameId,
            },
          },
        }),
    })
    t.list.field('staff', {
      type: 'Participant',
      resolve: async (tournament, _, { prisma }) => {
        const host = await findParticipantsWithRole({
          prisma,
          tournamentId: tournament.id,
          participantRole: ParticipantRoleType.HOST,
        })
        const moderators = await findParticipantsWithRole({
          prisma,
          tournamentId: tournament.id,
          participantRole: ParticipantRoleType.MODERATOR,
        })

        return host.concat(moderators)
      },
    })
    t.nonNull.field('hostUser', {
      type: 'User',
      resolve: async (tournament, _, { prisma }) => {
        const hostUser = await prisma.user.findFirst({
          where: {
            participants: {
              some: {
                roles: { some: { type: ParticipantRoleType.HOST } },
                tournamentId: tournament.id,
              },
            },
          },
        })
        if (!hostUser)
          throw new ApolloError('No hostUser found!', 'NOT_FOUND', {
            tournamentId: tournament.id,
          })

        return hostUser
      },
    })
    t.list.nonNull.field('userRoles', {
      type: 'ParticipantRoleType',

      resolve: async (tournament, _, { user, prisma }) => {
        const participantRoles = user
          ? (
              await prisma.participant.findFirst({
                where: {
                  tournamentId: tournament.id,
                  userId: user.id,
                },
                select: {
                  roles: { select: { type: true } },
                },
              })
            )?.roles
          : null

        return participantRoles?.length
          ? participantRoles.map((role) => role.type)
          : null
      },
    })
    t.int('staffCount', {
      resolve: async (tournament, _, { prisma }) => {
        const host = await countParticipantsWithRole({
          prisma,
          tournamentId: tournament.id,
          participantRole: ParticipantRoleType.HOST,
        })
        const moderators = await countParticipantsWithRole({
          prisma,
          tournamentId: tournament.id,
          participantRole: ParticipantRoleType.HOST,
        })

        return host + moderators
      },
    })
    t.list.field('players', {
      type: 'Participant',
      resolve: async (tournament, _, { prisma }) =>
        findParticipantsWithRole({
          prisma,
          tournamentId: tournament.id,
          participantRole: ParticipantRoleType.PLAYER,
        }),
    })
    t.int('playersCount', {
      resolve: async (tournament, _, { prisma }) =>
        countParticipantsWithRole({
          prisma,
          tournamentId: tournament.id,
          participantRole: ParticipantRoleType.PLAYER,
        }),
    })
    t.int('unassignedTickets', {
      resolve: async (tournament, __, { prisma }) =>
        prisma.ticket.count({
          where: { tournamentId: tournament.id, assigneeId: null },
        }),
    })
    t.field('activeRound', {
      type: 'Round',
      resolve: async (tournament, __, { prisma }) =>
        prisma.round.findFirst({
          where: {
            stage: { tournamentId: tournament.id },
            status: RoundStatus.ACTIVE,
          },
        }),
    })
    t.nonNull.int('completedRounds', {
      resolve: async (tournament, __, { prisma }) =>
        prisma.round.count({
          where: {
            stage: { tournamentId: tournament.id },
            status: RoundStatus.COMPLETED,
          },
        }),
    })
    t.int('roundsCount', {
      resolve: async (tournament, __, { prisma }) =>
        prisma.round.count({
          where: {
            stage: { tournamentId: tournament.id },
          },
        }),
    })
    t.field('winnerTeam', {
      type: 'Team',
      nullable: true,
      description:
        'Returns the team, that won the last match of the tournament (if possible) or null. Match counts as won if the combined scores are higher than (round.format/2)',
      resolve: async (tournament, __, { prisma }) => {
        const rounds = await prisma.round.findMany({
          where: { stage: { tournamentId: tournament.id } },
          orderBy: { number: 'asc' },
        })

        if (!rounds.length) return null

        const lastRound = rounds[rounds.length - 1]
        const minWinningScore = Math.ceil(lastRound.format / 2)
        const matches = await prisma.match.findMany({
          where: { roundId: lastRound.id },
          include: {
            matchGames: { include: { result: true } },
            opponents: true,
          },
        })
        if (!matches.length) return null
        // Final round has be a single match.
        if (matches.length !== 1) throw Error('Last round should have 1 match.')

        const finalMatch = matches[0]
        // Ignore if match has no opponents
        if (!finalMatch?.opponents?.length) return null
        const doneStates: MatchStatus[] = [
          MatchStatus.DONE,
          MatchStatus.NO_SHOW,
        ]
        // Ignore if match is not done yet
        if (!doneStates.includes(finalMatch.status)) return null

        if (finalMatch.opponents.length === 1) return finalMatch.opponents[0]

        const getScore = (teamId: string) => {
          const scores = finalMatch.matchGames.flatMap((matchGame) =>
            matchGame.result?.map((result) =>
              result.teamId === teamId ? result.score : 0
            )
          )
          if (!scores.length) return 0
          return scores.reduce((c, v) => c + v)
        }

        // Assign total scores to team
        const teamsWithScores: Array<{
          team: Team
          score: number
        }> = finalMatch.opponents.map((team) => ({
          team,
          score: getScore(team.id),
        }))
        // Sort teams by score. First in Array is winnerTeam (if score is higher than minWinningScore)
        const winnerTeam = [...teamsWithScores].sort(
          (a, b) => b.score - a.score
        )[0]
        return winnerTeam.score >= minWinningScore ? winnerTeam.team : null
      },
    })
  },
})

const findParticipantsWithRole = async ({
  prisma,
  tournamentId,
  participantRole,
}: {
  prisma: PrismaClient
  tournamentId: string
  participantRole: ParticipantRoleType
}) =>
  prisma.participant.findMany({
    where: {
      AND: {
        tournamentId,
        roles: { some: { type: participantRole } },
      },
    },
  })

const countParticipantsWithRole = async ({
  prisma,
  tournamentId,
  participantRole,
}: {
  prisma: PrismaClient
  tournamentId: string
  participantRole: ParticipantRoleType
}): Promise<number> =>
  prisma.participant.count({
    where: {
      AND: {
        tournamentId,
        roles: { some: { type: participantRole } },
      },
    },
  })
