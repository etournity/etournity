import { objectType, idArg, nonNull } from 'nexus'
import { userMatch } from '../../helpers/userMatch'
import { getCurrentTournament } from '../../helpers/getCurrentTournament'
import { ParticipantRoleType } from '@prisma/client'
import { GameUser, Match, Participant, User } from 'nexus-prisma'

export const UserType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id)
    t.field(User.displayName)
    t.field(User.participants)
    t.field(User.linkedAccounts)
    t.field(User.gameUsers)
    t.field(User.permissions)
    t.field(User.hideAlphaDisclaimer)
    t.field(User.roles)
    t.field(User.updatedAt)
    t.field(User.createdAt)

    t.field('currentMatch', {
      type: Match.$name,
      resolve: async (user, _, { prisma }) =>
        userMatch({
          prisma,
          userId: user.id,
        }),
    })
    t.field('currentParticipant', {
      type: Participant.$name,
      resolve: async (user, __, { prisma }) => {
        const currentTournament = await getCurrentTournament(prisma, user.id)

        if (!currentTournament) return null

        const currentParticipant = currentTournament.participants.find(
          ({ userId }) => userId === user.id
        )
        return currentParticipant ?? null
      },
    })
    t.field('currentHost', {
      type: Participant.$name,
      resolve: async (user, __, { prisma }) => {
        const currentTournament = await getCurrentTournament(
          prisma,
          user.id,
          ParticipantRoleType.HOST
        )

        if (!currentTournament) return null

        const currentHost = currentTournament.participants.find(
          ({ userId }) => userId === user.id
        )

        return currentHost ?? null
      },
    })
    t.field('gameUserFromTournament', {
      args: {
        tournamentId: nonNull(idArg()),
      },
      type: GameUser.$name,
      resolve: async (user, { tournamentId }, { prisma }) => {
        const tournament = await prisma.tournament.findUnique({
          where: {
            id: tournamentId,
          },
        })

        if (tournament) {
          return prisma.gameUser.findUnique({
            where: {
              GameUser_userId_gameId_key: {
                gameId: tournament.gameId,
                userId: user.id,
              },
            },
          })
        }

        return null
      },
    })
    t.field('participantFromTournament', {
      args: { tournamentId: nonNull(idArg()) },
      type: Participant.$name,
      resolve: async (user, { tournamentId }, { prisma }) => {
        const tournament = await prisma.tournament.findUnique({
          where: {
            id: tournamentId,
          },
        })

        if (tournament) {
          return prisma.participant.findUnique({
            where: {
              participant_userId_tournamentId_key: {
                tournamentId,
                userId: user.id,
              },
            },
          })
        }

        return null
      },
    })
  },
})
