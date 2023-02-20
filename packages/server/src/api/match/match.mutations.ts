import {
  extendType,
  idArg,
  arg,
  stringArg,
  inputObjectType,
  nonNull,
  list,
} from 'nexus'
import { MatchStatus, GameStatus, MatchGame } from '@prisma/client'
import dayjs from 'dayjs'
import { setMatchWinner } from '../../helpers/setMatchWinner'
import { createMatchGame } from '../matchGame/matchGame.mutations'
import { closeTicket } from '../../helpers/closeTicket'
import { ResultCreateInput } from '../result/result.mutations'
import { endRound } from '../../helpers/endRound'
import { progressMatchWinner } from '../../helpers/progressMatchWinner'
import { Match } from 'nexus-prisma'
import { startMatch } from '../../helpers/startMatch'
import { closeMatchTickets } from '../../helpers/closeMatchTickets'

export const MatchResultInput = inputObjectType({
  name: 'MatchResultInput',
  definition(t) {
    t.nonNull.id('matchGameId')
    t.list.field('results', { type: ResultCreateInput })
  },
})

export const MatchMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createMatch', {
      type: Match.$name,
      args: {
        roundId: nonNull(idArg()),
        opponentIds: nonNull(list(nonNull(idArg()))),
      },
      resolve: async (
        _,
        { roundId, opponentIds }: { roundId: string; opponentIds: string[] },
        { prisma }
      ) => {
        if (!opponentIds || opponentIds.length < 2)
          throw new Error('opponentIDs need to be specified')

        const matchNumber =
          ((
            await prisma.stage.findFirst({
              where: { rounds: { some: { id: roundId } } },
              select: {
                rounds: { select: { matches: { select: { id: true } } } },
              },
            })
          )?.rounds.flat().length ?? 0) + 1

        return prisma.match.create({
          data: {
            round: { connect: { id: roundId } },
            number: matchNumber,
            opponents: {
              connect: opponentIds.map((opponentId) => ({
                id: opponentId,
              })),
            },
          },
        })
      },
    })

    t.field('deleteMatch', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (_, { matchId }, { prisma }) =>
        prisma.match.delete({ where: { id: matchId } }),
    })
    t.field('resetMatch', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
        ticketId: idArg(),
        verdict: stringArg(),
      },
      resolve: async (
        _,
        { matchId, ticketId, verdict },
        { prisma, pubsub, user }
      ) => {
        const match = await prisma.match.update({
          where: { id: matchId },
          data: {
            gameLobbyCode: null,
            inGame: [],
            readyChecks: {},
            matchGames: {},
            status: MatchStatus.STARTED,
            noShowTimer: dayjs().add(10, 'minutes').toDate(),
          },
          include: { matchGames: { include: { submissions: true } } },
        })

        await prisma.readyCheck.deleteMany({ where: { matchId } })

        await prisma.matchGame.deleteMany({ where: { matchId } })

        if (ticketId)
          await closeTicket({ prisma, pubsub, user }, ticketId, verdict)

        await startMatch({ prisma, pubsub, user }, matchId)

        await pubsub.publish(Match.$name, matchId, 'resetMatch', match)
        return match
      },
    })
    t.field('setMatchWinner', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
        winnerId: nonNull(idArg()),
        ticketId: idArg(),
        verdict: stringArg(),
      },
      resolve: async (
        _,
        { matchId, winnerId, ticketId, verdict },
        { prisma, pubsub, user }
      ) => {
        const match = await setMatchWinner(
          { prisma, pubsub, user },
          matchId,
          winnerId
        )

        if (ticketId)
          await closeTicket({ prisma, pubsub, user }, ticketId, verdict)

        await pubsub.publish(Match.$name, matchId, 'setWinner', match)

        return match
      },
    })
    t.field('setMatchResults', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
        matchGameResults: nonNull(
          list(
            nonNull(
              arg({
                type: MatchResultInput,
              })
            )
          )
        ),
        ticketId: idArg(),
        verdict: stringArg(),
      },
      resolve: async (
        _,
        { matchId, matchGameResults, ticketId, verdict },
        { prisma, pubsub, user }
      ) => {
        const match = await prisma.match.findUnique({
          where: { id: matchId },
          include: {
            matchGames: { select: { id: true, result: true } },
            opponents: true,
          },
        })
        if (!match) throw Error("Can't find match in 'setMatchResults'.")

        // Reset existing results
        await Promise.all(
          match.matchGames.map(({ id }) =>
            prisma.result.updateMany({
              where: { matchGameId: id },
              data: { matchGameId: null },
            })
          )
        )

        // Set new results
        await Promise.all(
          matchGameResults.map(({ matchGameId, results }) => {
            if (results) {
              return prisma.matchGame.update({
                where: { id: matchGameId },
                data: {
                  status: GameStatus.MANUAL_EDIT,
                  result: {
                    create: results.map((result) => ({
                      score: result?.score ?? 0,
                      team: { connect: { id: result?.teamId } },
                    })),
                  },
                },
              })
            }

            return null
          })
        )

        const returnMatch = await prisma.match.update({
          where: { id: matchId },
          data: { status: MatchStatus.DONE },
        })

        await progressMatchWinner(prisma, matchId)
        await endRound({ prisma, pubsub, user }, undefined, matchId)
        if (ticketId)
          await closeTicket({ prisma, pubsub, user }, ticketId, verdict)

        await pubsub.publish(
          Match.$name,
          matchId,
          'setMatchResults',
          returnMatch
        )

        return returnMatch
      },
    })
    t.nonNull.field('addOpponent', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
        teamId: nonNull(idArg()),
      },
      resolve: async (_, { matchId, teamId }, { prisma, pubsub }) => {
        const match = await prisma.match.update({
          where: { id: matchId },
          data: {
            opponents: {
              connect: {
                id: teamId,
              },
            },
          },
        })

        await pubsub.publish(Match.$name, match?.id, 'addOpponent', match)
        return match
      },
    })

    t.nonNull.field('removeOpponent', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
        teamId: nonNull(idArg()),
      },
      resolve: async (_, { matchId, teamId }, { prisma, pubsub }) => {
        const match = await prisma.match.update({
          where: { id: matchId },
          data: {
            opponents: {
              disconnect: {
                id: teamId,
              },
            },
          },
        })

        await pubsub.publish(Match.$name, match?.id, 'removeOpponent', match)
        return match
      },
    })

    t.nonNull.field('changeStatus', {
      type: Match.$name,
      args: {
        matchId: nonNull(idArg()),
        status: nonNull(arg({ type: 'MatchStatus' })),
      },
      resolve: async (_, { matchId, status }, { prisma, pubsub, user }) => {
        if (status === MatchStatus.STARTED) {
          const match = await startMatch({ prisma, pubsub, user }, matchId)
          if (match) {
            await pubsub.publish(Match.$name, match?.id, 'startMatch', match)
            return match
          }
        }

        const match = await prisma.match.update({
          where: { id: matchId },
          data: { status },
        })

        if (status === MatchStatus.DONE) {
          await progressMatchWinner(prisma, match.id)
          await closeMatchTickets({ prisma, pubsub, user }, match.id)
          await endRound({ prisma, pubsub, user }, undefined, match.id)
        }

        await pubsub.publish(Match.$name, match?.id, 'changeStatus', match)
        return match
      },
    })

    t.field('addLobbyCode', {
      type: Match.$name,

      args: {
        matchId: nonNull(idArg()),
        lobbycode: nonNull(stringArg()),
      },
      resolve: async (_, { matchId, lobbycode }, { prisma, pubsub }) => {
        const match = await prisma.match
          .update({
            where: { id: matchId },
            data: {
              gameLobbyCode: lobbycode,
            },
            include: { round: true, matchGames: true },
          })
          .then(async (result) => {
            const matchGames: Array<MatchGame | null> = []
            for (let i = 0; i < (result.round?.format || 1); i++) {
              matchGames.push(
                // eslint-disable-next-line no-await-in-loop
                await createMatchGame({ matchId, prisma, pubsub })
              )
            }

            return { ...result, matchGames }
          })

        await pubsub.publish(Match.$name, match?.id, 'addLobbyCode', match)
        return match
      },
    })

    t.field('addToInGame', {
      type: Match.$name,

      args: {
        matchId: nonNull(idArg()),
      },
      resolve: async (_, { matchId }, { prisma, user, pubsub }) => {
        const match = await prisma.match.findUnique({ where: { id: matchId } })
        if (match && match.inGame.length >= 1) {
          await prisma.match.update({
            where: { id: matchId },
            data: { status: 'GAME_PHASE' },
          })
        }

        const participant = await prisma.participant.findFirst({
          where: {
            userId: user.id,
            team: { matches: { some: { id: matchId } } },
          },
        })

        if (!participant) return null

        const inGame = match?.inGame ?? []
        const returnMatch = await prisma.match.update({
          where: { id: matchId },
          data: {
            inGame: { set: [...inGame, participant.id] },
          },
        })

        await pubsub.publish(
          Match.$name,
          returnMatch.id,
          'addToInGame',
          returnMatch
        )
        return returnMatch
      },
    })
  },
})
