import {
  arg,
  extendType,
  idArg,
  inputObjectType,
  list,
  nonNull,
  stringArg,
} from 'nexus'
import { StageType, Team, Prisma, Participant } from '@prisma/client'
import { getAverageElo } from '../team/team.type'
import { Round as NexusRound } from 'nexus-prisma'
import dayjs from 'dayjs'

enum Algorithms {
  SEED = 'seed',
  RANDOM = 'random',
}
export const BestOfInput = inputObjectType({
  name: 'BestOfInput',
  definition(t) {
    t.string('roundId')
    t.int('bestOf')
  },
})

export const StageMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('generateBrackets', {
      type: nonNull(list(nonNull(list(nonNull(list('String')))))),
      args: {
        tournamentId: nonNull(idArg()),
        algorithm: nonNull(stringArg()),
      },
      resolve: async (_, { tournamentId, algorithm }, { prisma, pubsub }) => {
        // TODO: Add rate limiter

        let tournament = await prisma.tournament.findUnique({
          where: { id: tournamentId },
          include: {
            participants: {
              include: {
                team: {
                  include: {
                    participants: true,
                  },
                },
              },
            },
            stages: { include: { rounds: { include: { matches: true } } } },
          },
        })

        if (!tournament) throw Error('Tournament not found!')

        if (dayjs().isBefore(tournament.checkinEnd))
          throw Error('Tried to generate Brackets before CheckIn ended.')

        const getTeams = async (
          participants: Array<
            Participant & {
              team: (Team & { participants: Participant[] }) | null
            }
          >
        ) => {
          let teams =
            participants
              // Removes not checked-in participants
              ?.filter(({ checkedInAt }) => checkedInAt !== null)
              .map((p) => p?.team)
              // Removes nulls
              .filter((team) => team) ?? []

          // Generate seeds for teams if there are none or highest seed exceeds number of teams
          if (
            !teams.every((team) => team?.seed) ||
            teams.length <
              (teams.sort((a, b) => (b?.seed ?? 0) - (a?.seed ?? 0))[0]?.seed ??
                0)
          ) {
            const teamsWithElo = await Promise.all(
              teams.map(async (team) => {
                if (!team?.id) return
                const averageElo = await getAverageElo({
                  teamId: team?.id,
                  prisma,
                })
                return { team, averageElo }
              })
            )

            teamsWithElo
              .sort((a, b) => (b?.averageElo ?? 0) - (a?.averageElo ?? 0))
              .map(async (team, i) => ({
                team: await prisma.team.update({
                  where: {
                    id: team?.team?.id,
                  },
                  data: {
                    seed: i + 1,
                  },
                  include: { participants: true },
                }),
              }))
            teams = teamsWithElo?.map((team, i) =>
              team ? { ...team.team, seed: i + 1 } : null
            )
          }

          return teams
        }

        const matchesExist =
          (tournament.stages[0].rounds?.[0]?.matches?.length ?? 0) > 0

        const currentRoundAmount = tournament.stages[0].rounds?.length
        const desiredRoundAmount = roundAmountFromParams({
          teamAmount: (await getTeams(tournament.participants)).length,
          type: tournament?.stages[0].type ?? null,
        })
        const roundsToAdd = desiredRoundAmount - currentRoundAmount
        tournament = await prisma.tournament.update({
          where: { id: tournamentId },

          data: {
            stages: {
              update: {
                where: {
                  id: tournament.stages[0].id,
                },
                data: {
                  rounds:
                    roundsToAdd > 0
                      ? {
                          create: Array(roundsToAdd)
                            .fill(null)
                            .map((_, index) => ({
                              number: currentRoundAmount + index + 1,
                              // TO-DO: Add best of input.
                              format: 3,
                            })),
                        }
                      : {
                          deleteMany: { number: { gt: desiredRoundAmount } },
                        },
                },
              },
            },
          },
          include: {
            participants: {
              include: {
                team: {
                  include: {
                    participants: true,
                  },
                },
              },
            },
            stages: { include: { rounds: { include: { matches: true } } } },
          },
        })

        // Remove matches if there are any
        if (matchesExist)
          await prisma.match.deleteMany({
            where: {
              round: {
                stage: {
                  tournament: {
                    id: tournamentId,
                  },
                },
              },
            },
          })

        const customSort = (
          array: Array<(Team & { participants: Participant[] }) | null>,
          algorithm: Algorithms,
          roundAmount: number
        ): Array<(Team & { participants: Participant[] }) | null> => {
          if (!array) throw Error('Expected teams array.')
          if (algorithm && !Object.values(Algorithms).includes(algorithm))
            throw Error(`${algorithm} is an invalid generator algorithm`)

          if (algorithm === Algorithms.RANDOM) {
            // Fill teams Array and add empties to handle byes.
            const desiredTeamAmount = 2 ** roundAmount
            const nullsToAdd = desiredTeamAmount - array.length

            const withNulls = array.concat(Array(nullsToAdd).fill(null))
            return withNulls.sort(() => Math.random() - 0.5)
          }

          if (algorithm === Algorithms.SEED) {
            // Sorting based on https://stackoverflow.com/questions/5770990/sorting-tournament-seeds/45572051#45572051
            // Sort teams by seed (e.g: 1 - 16)
            const bySeed = array.sort((a, b) => (a?.seed ?? 0) - (b?.seed ?? 0))
            const participantCount = bySeed.length
            // Desired finals (Seed 1 vs Seed 2)
            let matches: Array<Array<number | null>> = [[1, 2]]

            // Create seed list based on desired finals
            for (let round = 1; round < roundAmount; round++) {
              const roundMatches = []
              const sum = 2 ** (round + 1) + 1

              for (const match of matches) {
                let home = changeToBye(match[0], participantCount)
                let away = changeToBye(
                  match[0] ? sum - match[0] : null,
                  participantCount
                )
                roundMatches.push([home, away])
                home = changeToBye(
                  match[1] ? sum - match[1] : null,
                  participantCount
                )
                away = changeToBye(match[1], participantCount)
                roundMatches.push([home, away])

                matches = roundMatches
              }
            }

            return matches
              .flat(1)
              .map((seed) => array.find((team) => team?.seed === seed) ?? null)
          }

          return array
        }

        const sortedTeams = customSort(
          await getTeams(tournament.participants),
          algorithm as Algorithms,
          desiredRoundAmount
        )

        // Get opponent teams for a single match
        const matchOpponents = (i: number): Array<string | null> =>
          [sortedTeams[i * 2], sortedTeams[i * 2 + 1]] // Two teams per match
            .map((team) => team?.id ?? null)

        const bracketStructure = tournament?.stages?.[0]?.rounds
          ? Array(tournament?.stages?.[0]?.rounds?.length)
              .fill(null)
              .map((_, i) =>
                Array(
                  2 ** ((tournament?.stages?.[0]?.rounds?.length ?? 0) - 1) /
                    (i > 0 ? 2 ** i : 1)
                )
                  .fill(null)
                  .map((_, j) => (i === 0 ? matchOpponents(j) : []))
              )
          : []

        return bracketStructure
      },
    })
    t.field('publishBrackets', {
      type: NexusRound.$name,
      list: true,
      args: {
        tournamentId: idArg({ required: true }),
        publishInput: arg({
          type: nonNull(list(nonNull(list(list('String'))))),
        }),
        bestOfs: arg({ type: nonNull(list(BestOfInput)) }),
      },
      resolve: async (
        _,
        { tournamentId, publishInput, bestOfs },
        { prisma, pubsub }
      ) => {
        const rounds = await prisma.round.findMany({
          where: { stage: { tournamentId } },
          include: {
            matches: { include: { opponents: true } },
          },
          orderBy: { number: 'asc' },
        })
        let matchNumber = 0
        const returnRounds = await Promise.all(
          rounds.map((round, i) =>
            prisma.round.update({
              where: { id: round.id },
              data: {
                format:
                  bestOfs.find((bestOf) => bestOf?.roundId === round.id)
                    ?.bestOf ?? 3,
                matches: {
                  create: publishInput[i].map(
                    (matchArray): Prisma.MatchCreateInput => {
                      matchNumber++
                      return {
                        number: matchNumber,
                        opponents: {
                          connect: matchArray
                            ?.filter((teamId) => teamId !== null)
                            .map((teamId) => ({
                              id: teamId ?? undefined,
                            })),
                        },
                      }
                    }
                  ),
                },
              },
            })
          )
        )

        const tournament = await prisma.tournament.findUnique({
          where: { id: tournamentId },
          include: {
            stages: { include: { rounds: { include: { matches: true } } } },
            participants: true,
          },
        })

        await pubsub.publish(
          'Tournament',
          tournament?.id,
          'publishBrackets',
          tournament
            ? {
                ...tournament,
                stages: [{ ...tournament.stages[0], rounds: returnRounds }],
              }
            : undefined
        )
        return returnRounds
      },
    })
  },
})

// Remember to also update the function on the client side if you change this
// packages/client/components/tournament/creation/creationForms/generalInformationForm.tsx
export const roundAmountFromParams: ({
  teamAmount,
  type,
}: {
  teamAmount: number
  type: StageType | null
}) => number = ({ teamAmount, type }) => {
  if (teamAmount === 0) return 0
  switch (type) {
    case StageType.SINGLE:
      return Math.ceil(Math.log2(teamAmount))
    default:
      return 0
  }
}

const seededShuffle = (array: unknown[], seed: number) => {
  let m = array.length
  let t
  let i

  while (m) {
    i = Math.floor(random(seed) * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
    ++seed
  }

  return array
}

function random(seed: number) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function changeToBye(seed: number | null, participantCount: number) {
  if (!seed) return null
  return seed <= participantCount ? seed : null
}
