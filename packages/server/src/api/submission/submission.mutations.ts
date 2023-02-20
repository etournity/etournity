import { TicketType, GameStatus } from '.prisma/client'
import { arg, extendType, inputObjectType, nonNull, list } from 'nexus'
import { Submission } from 'nexus-prisma'
import { createTicket } from '../../helpers/createTicket'
import { setMatchGameStatus } from '../../helpers/setMatchGameStatus'
import { ResultCreateInput } from '../result/result.mutations'

export const SubmissionCreateInput = nonNull(
  inputObjectType({
    name: 'SubmissionCreateInput',
    definition(t) {
      t.nonNull.id('matchGameId')
      t.nonNull.id('teamId')
      t.int('number')
      t.nonNull.list.nonNull.field('results', {
        type: ResultCreateInput,
      })
    },
  })
)

export const SubmissionMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSubmissions', {
      type: Submission.$name,
      list: true,
      args: {
        data: list(arg({ type: SubmissionCreateInput })),
      },
      resolve: async (_, { data }, { prisma, pubsub, user }) => {
        if (!data?.length)
          throw Error("Can't create submissions. Missing data.")

        const submissions = await Promise.all(
          data.map(async ({ matchGameId, teamId, results }) =>
            prisma.submission.upsert({
              where: {
                submission_matchGameId_teamId_key: {
                  matchGameId,
                  teamId,
                },
              },
              create: {
                matchGame: { connect: { id: matchGameId } },
                team: { connect: { id: teamId } },
                results: {
                  create: results.map((result) => ({
                    teamId: result.teamId,
                    score: result.score,
                  })),
                },
              },
              update: {
                resubmitted: true,
                results: {
                  updateMany: results.map((result) => ({
                    where: { teamId: result.teamId },
                    data: { score: result.score },
                  })),
                },
              },
              include: {
                matchGame: true,
                results: true,
              },
            })
          )
        )

        const match = await prisma.match.findFirst({
          where: {
            matchGames: { some: { id: data[0].matchGameId } },
          },
          include: {
            matchGames: true,
            opponents: {
              include: {
                participants: { select: { userId: true } },
                submissions: {
                  where: {
                    matchGameId: {
                      in: data.map(({ matchGameId }) => matchGameId),
                    },
                  },
                  select: { id: true, resubmitted: true },
                },
              },
            },
            round: { select: { stage: { select: { tournamentId: true } } } },
          },
        })

        if (!match) throw Error("Can't find match on Submission creation.")

        const matchGames = await Promise.all(
          match.matchGames.map(async ({ id }) =>
            setMatchGameStatus(id, null, prisma, pubsub)
          )
        )

        const submissionsComplete = match.opponents.every(
          (team) => team.submissions.length === match.matchGames.length
        )

        const canProgress = match.matchGames.some(
          ({ status }) => status === GameStatus.CONFLICT
        )
          ? matchGames.every(
              ({ status }) =>
                status === GameStatus.SUCCESS ||
                status === GameStatus.MANUAL_EDIT
            )
          : true

        if (submissionsComplete && canProgress) {
          await prisma.match.update({
            where: { id: match.id },
            data: {
              inGame: [],
            },
          })
        }

        const needsTicket = match.matchGames.some(
          ({ status }) => status === GameStatus.CONFLICT
        )
          ? matchGames?.some(({ status }) => status === GameStatus.MANUAL_EDIT)
          : false

        if (needsTicket) {
          const tournamentId = match.round?.stage?.tournamentId
          if (!tournamentId)
            throw Error(
              "Can't create Score Issue Ticket. tournamentId missing."
            )
          await createTicket(
            {
              ticketType: TicketType.SCORE_CONFLICT,
              matchBlocked: true,
              tournamentId,
              matchId: match.id,
              message: 'Score Submission Issue',
            },
            prisma,
            pubsub
          )
        }

        const returnMatch = await prisma.match.findFirst({
          where: { id: match.id },
          include: { matchGames: { include: { submissions: true } } },
        })

        await pubsub.publish(
          'Match',
          match?.id,
          'createSubmissions',
          returnMatch ?? undefined
        )
        return submissions.map((submission) => ({
          ...submission,
          matchGame: {
            ...submission.matchGame,
            match: { id: returnMatch?.id, inGame: returnMatch?.inGame },
          },
        }))
      },
    })
  },
})
