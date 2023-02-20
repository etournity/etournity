import {
  extendType,
  arg,
  inputObjectType,
  FieldResolver,
  stringArg,
  idArg,
  booleanArg,
  intArg,
  nonNull,
} from 'nexus'
import { isUserRegistered } from '../../helpers/isUserRegistered'
import {
  ParticipantRoleType,
  MatchStatus,
  TournamentStatus,
  RoundStatus,
  Tournament,
} from '@prisma/client'
import { closeTicket } from '../../helpers/closeTicket'
import { Tournament as TournamentN, Participant } from 'nexus-prisma'
import { startRound } from '../../helpers/startRound'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { kickParticipant } from '../../helpers/kickParticipant'
import { closeMatchTickets } from '../../helpers/closeMatchTickets'
import { removeUnregisteredParticipants } from '../../helpers/removeUnregisteredParticipants'
dayjs.extend(isBetween)
import { mixpanel } from '../../globals'
import { createChatRoom } from '../../helpers/createChatRoom'
import { addChatRoomMember } from '../../helpers/addChatRoomMember'

export const TournamentCreateInput = nonNull(
  inputObjectType({
    name: 'TournamentCreateInput',
    definition(t) {
      t.nonNull.string('title')
      t.nonNull.string('description')
      t.nonNull.dateTime('date')
      t.nonNull.int('maxPlayers')
      t.dateTime('checkinStart')
      t.dateTime('checkinEnd')
      t.nonNull.int('noShow')
      t.id('region')
      t.string('supportLink')
      t.string('streamLink')
      t.string('prizePool')
      t.nonNull.list.nonNull.id('platforms')
      t.nonNull.string('rules')
      t.nonNull.string('gameId')
      t.nonNull.id('gameModeId')
      t.nonNull.field('type', { type: 'StageType' })
      t.id('language')
    },
  })
)

export const TournamentMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTournament', {
      type: TournamentN.$name,

      args: {
        data: nonNull(
          arg({
            type: TournamentCreateInput,
          })
        ),
      },
      resolve: createTournamentResolver,
    })
    t.nullable.field('deleteTournament', {
      type: TournamentN.$name,

      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: async (_, { tournamentId }, { prisma, pubsub, user }) => {
        let tournament = await prisma.tournament.findUnique({
          where: { id: tournamentId },
        })

        if (!tournament) throw new Error('Tournament to delete not found!')

        const completedRounds = await prisma.round.count({
          where: {
            stage: { tournamentId },
            status: RoundStatus.COMPLETED,
          },
        })

        const roundsCount = await prisma.round.count({
          where: {
            stage: { tournamentId },
          },
        })

        if (tournament?.status === TournamentStatus.DRAFT) {
          await prisma.tournament.delete({ where: { id: tournamentId } })
          await pubsub.publish(
            TournamentN.$name,
            tournament?.id,
            'deleteTournament',
            tournament ?? undefined
          )
          mixpanel.track('Tournament Deleted', {
            distinct_id: user.id,
            tournamentId: tournament.id,
          })
          return null
        }

        if (completedRounds === roundsCount) {
          tournament = await prisma.tournament
            .update({
              where: { id: tournamentId },
              data: { status: TournamentStatus.FINISHED },
            })
            .then((tournament: Tournament) => {
              mixpanel.track('Tournament Finished', {
                distinct_id: user.id,
                tournamentId: tournament.id,
                link: `${process.env.CLIENT_URL}/${tournament.id}`,
              })
              return tournament
            })
        } else {
          tournament = await prisma.tournament
            .update({
              where: { id: tournamentId },
              data: { status: TournamentStatus.CANCELLED },
            })
            .then((tournament: Tournament) => {
              mixpanel.track('Tournament Cancelled', {
                distinct_id: user.id,
                tournamentId: tournament.id,
                link: `${process.env.CLIENT_URL}/tournament/${tournament.id}`,
              })
              return tournament
            })
          await prisma.round.updateMany({
            where: { stage: { tournamentId } },
            data: { status: RoundStatus.COMPLETED },
          })
          await prisma.match
            .updateMany({
              where: { round: { stage: { tournamentId } } },
              data: { status: MatchStatus.DONE },
            })
            .then(async () => {
              await prisma.ticket.updateMany({
                where: { tournamentId, matchId: { not: null } },
                data: {
                  resolved: true,
                  verdict:
                    'Issue automatically dismissed. Tournament was cancelled.',
                },
              })
            })
        }

        await pubsub.publish(
          TournamentN.$name,
          tournament?.id,
          'cancelTournament',
          tournament ?? undefined
        )
        return tournament
      },
    })
    t.field('updateTournament', {
      type: TournamentN.$name,

      args: {
        tournamentId: nonNull(idArg()),
        data: nonNull(
          arg({
            type: TournamentCreateInput,
          })
        ),
      },
      resolve: updateTournamentResolver,
    })
    t.field('addParticipant', {
      type: Participant.$name,
      args: {
        tournamentId: nonNull(idArg()),
        requestingMod: booleanArg(),
        elo: intArg(),
        name: stringArg(),
      },
      resolve: addParticipantResolver,
    })
    t.field('removeParticipant', {
      type: Participant.$name,

      args: {
        tournamentId: nonNull(idArg()),
        userId: idArg(),
      },
      resolve: removeParticipantResolver,
    })
    t.field('checkinParticipant', {
      type: Participant.$name,

      args: {
        tournamentId: nonNull(idArg()),
      },
      resolve: checkinParticipantResolver,
    })
    t.field('kickParticipant', {
      type: Participant.$name,

      args: {
        participantId: nonNull(idArg()),
      },
      resolve: async (_, { participantId }, ctx) => {
        const participant = await kickParticipant(ctx, participantId)

        // The match returned  by kickParticipant is always the currently activeMatch of that participant
        const matchId = participant.team?.matches?.[0]?.id
        if (matchId) await closeMatchTickets(ctx, matchId)

        return participant
      },
    })
    t.field('setTournamentStatus', {
      type: TournamentN.$name,
      args: {
        tournamentId: nonNull(idArg()),
        status: nonNull(arg({ type: 'TournamentStatus' })),
        ticketId: idArg(),
        verdict: stringArg(),
      },
      resolve: async (
        _,
        { tournamentId, status, ticketId, verdict },
        { prisma, pubsub, user }
      ) => {
        const tournament = await prisma.tournament.update({
          where: { id: tournamentId },
          data: {
            status,
            publishedAt:
              status === TournamentStatus.PUBLISHED
                ? dayjs().toDate()
                : undefined,
          },
          include: { stages: { select: { rounds: true } } },
        })
        const firstRound = tournament.stages[0].rounds.find(
          (round) => round.number === 1
        )
        if (status === TournamentStatus.STARTED && firstRound) {
          await removeUnregisteredParticipants(prisma, pubsub, tournamentId)
          await startRound({ prisma, pubsub, user }, firstRound)
          mixpanel.track('Tournament Started', {
            distinct_id: user.id,
            tournamentId: tournament.id,
            link: `${process.env.CLIENT_URL}/tournament/${tournament.id}`,
          })
        }

        if (ticketId)
          await closeTicket({ prisma, pubsub, user }, ticketId, verdict)

        await pubsub.publish(
          TournamentN.$name,
          tournament?.id,
          'setStatus',
          tournament
        )
        return tournament
      },
    })
    t.field('setStartTime', {
      type: TournamentN.$name,
      args: {
        tournamentId: nonNull(idArg()),
        startTime: arg({ type: 'DateTime' }),
      },
      resolve: async (_, { tournamentId, startTime }, { prisma, pubsub }) => {
        const tournament = await prisma.tournament.update({
          where: { id: tournamentId },
          data: { date: startTime },
        })

        await pubsub.publish(
          TournamentN?.$name,
          tournament?.id,
          'setStartTime',
          tournament
        )
        return tournament
      },
    })
    t.field('setCheckIn', {
      type: TournamentN.$name,
      args: {
        tournamentId: nonNull(idArg()),
        startTime: arg({ type: 'DateTime' }),
        endTime: arg({ type: 'DateTime' }),
      },
      resolve: async (
        _,
        { tournamentId, startTime, endTime },
        { prisma, pubsub }
      ) => {
        const tournament = await prisma.tournament.findUnique({
          where: { id: tournamentId },
          select: { date: true, checkinStart: true, checkinEnd: true },
        })

        if (!tournament)
          throw new Error(`Couldn't find tournament ${tournamentId}!`)

        let { date } = tournament
        // Set back Check-in End if frame is less than 5 minutes.
        if (
          startTime &&
          dayjs(startTime).add(5, 'minutes').isAfter(tournament?.checkinEnd)
        ) {
          endTime = dayjs(startTime).add(5, 'minutes')
        }

        // Set back tournament start if frame is less than 5 minutes.
        if (
          endTime &&
          dayjs(endTime).add(5, 'minutes').isAfter(tournament?.date)
        ) {
          date = dayjs(endTime).add(5, 'minutes').toDate()
        }

        const returnament = await prisma.tournament.update({
          where: { id: tournamentId },
          data: { checkinStart: startTime, checkinEnd: endTime, date },
        })

        await pubsub.publish(
          TournamentN.$name,
          returnament?.id,
          'setStartTime',
          returnament
        )
        return returnament
      },
    })
  },
})

const createTournamentResolver: FieldResolver<
  'Mutation',
  'createTournament'
> = async (_, { data }, { prisma, user }) => {
  const tournament = prisma.tournament
    .create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        supportLink: data.supportLink,
        // Should be added to the creation in the future
        discordLink: data.supportLink,
        streamLink: data.streamLink,
        maxPlayers: data.maxPlayers,
        checkinStart: data.checkinStart,
        checkinEnd: data.checkinEnd,
        noShow: data.noShow,
        prizePool: data.prizePool,
        language: {
          connect: {
            code: data.language ?? undefined,
          },
        },

        region: {
          connect: {
            code: data.region ?? undefined,
          },
        },
        game: {
          connect: {
            id: data.gameId,
          },
        },
        gameMode: { connect: { id: data.gameModeId } },
        rules: data.rules,
        participants: {
          create: {
            roles: { create: { type: ParticipantRoleType.HOST } },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
        platforms: {
          connect: data.platforms.map((platform) => ({ code: platform })),
        },
        stages: {
          create: {
            type: data.type,
          },
        },
      },
    })
    .then(async (tournament) => {
      mixpanel.track('Tournament Created', {
        distinct_id: user.id,
        tournamentId: tournament.id,
        link: `${process.env.CLIENT_URL}/tournament/${tournament.id}`,
      })
      await createChatRoom(
        {
          name: 'General Chat',
          members: [user],
          tournamentId: tournament.id,
        },
        prisma
      )
      return tournament
    })
  return tournament
}

const updateTournamentResolver: FieldResolver<
  'Mutation',
  'updateTournament'
> = async (_, { tournamentId, data }, { prisma, pubsub }) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: { stages: { select: { id: true } } },
  })

  const updatedTournament = await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      supportLink: data.supportLink,
      streamLink: data.streamLink,
      maxPlayers: data.maxPlayers,
      checkinStart: data.checkinStart,
      checkinEnd: data.checkinEnd,
      prizePool: data.prizePool,
      noShow: data.noShow,
      gameMode: {
        connect: {
          id: data.gameModeId,
        },
      },
      rules: data.rules,
      language: {
        connect: {
          code: data.language ?? undefined,
        },
      },

      region: {
        connect: {
          code: data.region ?? undefined,
        },
      },
      game: {
        connect: {
          id: data.gameId,
        },
      },
      platforms: {
        set: data.platforms.map((platform) => ({ code: platform })),
      },
      stages: {
        update: {
          where: { id: tournament?.stages[0].id },
          data: {
            type: data.type,
          },
        },
      },
    },
  })

  await pubsub.publish(
    TournamentN.$name,
    updatedTournament?.id,
    'updateTournament',
    updatedTournament
  )
  return updatedTournament
}

const addParticipantResolver: FieldResolver<
  'Mutation',
  'addParticipant'
> = async (
  _,
  { tournamentId, name, elo, requestingMod },
  { prisma, user, pubsub }
) => {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      participants: {
        include: { roles: true, user: { select: { id: true } } },
      },
      chatRoom: { select: { id: true } },
    },
  })

  if (!tournament) throw Error(`Tournament with id ${tournamentId} not found!`)
  if (!(name && elo) && !requestingMod)
    throw Error(`Can't add participant without parameters!`)
  if (dayjs().isAfter(tournament.checkinEnd) && name && elo)
    throw Error(
      `Outside of registration window. It's too late now to say sorry!`
    )
  const userParticipant = tournament.participants.find(
    (p) => p.user.id === user.id
  )

  if (userParticipant) {
    // Check if participant has 'player' or 'host' roles and if they want to register as a player (name && elo).
    if (
      userParticipant?.roles.some(
        (role) =>
          role.type === ParticipantRoleType.PLAYER ||
          role.type === ParticipantRoleType.HOST
      ) &&
      name &&
      elo
    )
      throw Error(`User with id ${user.id} already registered!`)
    if (requestingMod) {
      const participant = await prisma.participant.update({
        where: { id: userParticipant?.id },
        data: { requestingMod: requestingMod ?? undefined },
        include: { tournament: true },
      })

      if (!(name && elo)) {
        await pubsub.publish(
          'Tournament',
          participant.tournament?.id,
          'addParticipant',
          {
            ...tournament,
            participants: [
              tournament.participants.map((p) =>
                p.id === participant.id ? participant : p
              ),
            ],
          }
        )
        return participant
      }
    }
  }

  if (name) {
    const teamWithName = await prisma.team.findUnique({
      where: {
        team_name_tournamentId_key: { name, tournamentId },
      },
    })
    if (teamWithName) throw Error(`${name} already exists in this tournament.`)
  }

  if (name && elo) {
    await prisma.gameUser.upsert({
      where: {
        GameUser_userId_gameId_key: {
          gameId: tournament.gameId,
          userId: user.id,
        },
      },
      create: {
        elo,
        inGameName: name,
        user: {
          connect: {
            id: user.id,
          },
        },
        game: {
          connect: {
            id: tournament.gameId,
          },
        },
      },
      update: {
        elo,
        inGameName: name,
      },
    })
  }

  const participant = await prisma.participant
    .upsert({
      where: { id: userParticipant?.id ?? '' },
      create: {
        user: {
          connect: {
            id: user.id,
          },
        },
        roles:
          name && elo
            ? { create: { type: ParticipantRoleType.PLAYER } }
            : undefined,
        tournament: {
          connect: {
            id: tournamentId,
          },
        },
        requestingMod: requestingMod ?? false,
      },
      update: {
        roles:
          name && elo
            ? { create: { type: ParticipantRoleType.PLAYER } }
            : undefined,
        registeredAt: name && elo ? new Date() : undefined,
      },
      include: { tournament: true },
    })
    .then(async (participant) => {
      if (!userParticipant?.id)
        if (tournament.chatRoom?.id) {
          await addChatRoomMember(
            {
              chatRoomId: tournament.chatRoom?.id,
              userId: user.id,
            },
            prisma,
            pubsub
          )
        }

      mixpanel.track('Participant Registered', {
        distinct_id: user.id,
        tournamentId,
        link: `${process.env.CLIENT_URL}/tournament/${tournamentId}`,
      })
      return participant
    })
  if (name) {
    // TODO: Rework for teamsizes bigger than 1
    await prisma.team.create({
      data: {
        name,
        tournament: { connect: { id: tournamentId } },
        leader: {
          connect: { id: participant.id },
        },
        participants: {
          connect: {
            id: participant.id,
          },
        },
      },
    })
  }

  await pubsub.publish(
    TournamentN.$name,
    participant.tournament?.id,
    'addParticipant',
    {
      ...tournament,
      participants: [
        tournament.participants.map((p) =>
          p.id === participant.id ? participant : p
        ),
      ],
    }
  )
  return participant
}

const removeParticipantResolver: FieldResolver<
  'Mutation',
  'removeParticipant'
> = async (_, { tournamentId }, { prisma, user, pubsub }) => {
  const team = await prisma.team.findFirst({
    where: { participants: { every: { userId: user.id, tournamentId } } },
    select: { participants: true, id: true },
  })

  const participant = await prisma.participant.update({
    where: {
      participant_userId_tournamentId_key: {
        tournamentId,
        userId: user.id,
      },
    },
    data: {
      checkedInAt: null,
      registeredAt: null,
      roles: {
        deleteMany: {
          type: {
            equals: ParticipantRoleType.PLAYER,
          },
        },
      },
    },
  })

  if (!participant || !team)
    throw Error(`User with id ${user.id} not registered!`)

  if (team && (team.participants?.length ?? 0) <= 1)
    await prisma.team.delete({ where: { id: team.id } })

  await pubsub.publish(TournamentN.$name, tournamentId, 'removeParticipant')
  return participant
}

const checkinParticipantResolver: FieldResolver<
  'Mutation',
  'checkinParticipant'
> = async (_, { tournamentId }, { prisma, user, pubsub }) => {
  const userRegistered = await isUserRegistered({
    prisma,
    tournamentId,
    userId: user.id,
  })

  if (!userRegistered) throw Error(`User with id ${user.id} is not registered!`)

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: {
      id: true,
      checkinStart: true,
      checkinEnd: true,
    },
  })
  if (!dayjs().isBetween(tournament?.checkinStart, tournament?.checkinEnd))
    throw Error(`Not inside check-in window! Check-in is not available.`)

  const userParticipants = await prisma.participant.findMany({
    where: { userId: user.id },
    include: {
      tournament: {
        select: {
          id: true,
          status: true,
          checkinStart: true,
          checkinEnd: true,
        },
      },
      roles: { select: { type: true } },
    },
  })
  /**
   * User is active when:
   * - Tournament is in an active state AND
   * - user is a player and checked in OR
   * - user is the tournament host
   * */
  const isActiveInOtherTournament = userParticipants?.some((participant) => {
    const activeTournament =
      participant?.tournament?.id !== tournamentId &&
      (participant?.tournament?.status === TournamentStatus.STARTED ||
        participant?.tournament?.status === TournamentStatus.ERROR ||
        (participant?.tournament?.status === TournamentStatus.PUBLISHED &&
          dayjs().isBetween(
            participant.tournament.checkinStart,
            participant.tournament.checkinEnd
          )))
    return (
      activeTournament &&
      (participant?.roles.some(
        (role) => role.type === ParticipantRoleType.HOST
      ) ||
        (participant?.roles.some(
          (role) => role.type === ParticipantRoleType.PLAYER
        ) &&
          participant.checkedInAt !== null))
    )
  })
  if (isActiveInOtherTournament)
    throw Error(
      "User is already active in another tournament. Finish what you've started!"
    )
  const participant = await prisma.participant
    .update({
      where: {
        participant_userId_tournamentId_key: {
          tournamentId,
          userId: user.id,
        },
      },
      data: {
        checkedInAt: new Date(),
      },
    })
    .then((participant) => {
      mixpanel.track('Participant Checked in', {
        distinct_id: user.id,
        tournamentId,
        link: `${process.env.CLIENT_URL}/tournament/${tournamentId}`,
      })
      return participant
    })

  await pubsub.publish(TournamentN.$name, tournament?.id, 'checkinParticipant')
  return participant
}
