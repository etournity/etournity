import { shield, or, deny, allow } from 'graphql-shield'
import * as rules from './rules'

// Full documentation: https://github.com/maticzav/graphql-shield
export const permissions = shield(
  {
    Query: {
      tournaments: rules.hasPermissions('tournament.view'),
      tournament: rules.hasPermissions('tournament.view'),
      tournamentStages: rules.hasPermissions('tournament.view'),
      user: rules.isAuthenticated,
      users: rules.isAuthenticated,
      me: rules.isAuthenticated,
      match: rules.isAuthenticated,
      participants: rules.isAuthenticated,
      participantsFromTournament: rules.isAuthenticated,
      tournamentTickets: rules.isAuthenticated,
      relatedTickets: rules.isAuthenticated,
      userParticipants: rules.isAuthenticated,
      games: rules.isAuthenticated,
      savestates: rules.isDevEnvironment(),
      languages: rules.hasPermissions('tournament.view'),
      regions: rules.hasPermissions('tournament.view'),
      relatedChatRooms: rules.isAuthenticated,
      chatRoomMessages: rules.isAuthenticated,
    },
    Mutation: {
      createTournament: rules.hasPermissions('tournament.create'),
      createTeam: rules.hasPermissions('team.create'),
      createGame: rules.hasPermissions('game.create'),
      createMatch: rules.hasPermissions('match.create'),
      createMatchGame: rules.hasPermissions('match.create'),
      createReadyCheck: rules.hasPermissions('match.readycheck.create'),
      changeStatus: rules.hasPermissions('match.status.update'),
      removeOpponent: rules.hasPermissions('match.opponent.remove'),
      addOpponent: rules.hasPermissions('match.opponent.add'),
      createOrUpdateGameUser: rules.hasPermissions('gameuser.create'),
      updateTournament: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      updateElo: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      updateSeed: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      updateParticipantRoles: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      setUsername: or(
        rules.hasPermissions('admin.users.update'),
        rules.isUser()
      ),
      setHideDisclaimer: or(
        rules.hasPermissions('admin.users.update'),
        rules.isUser()
      ),
      createTicket: rules.isAuthenticated,
      createSystemTicket: rules.isAuthenticated,
      addLobbyCode: rules.hasTournamentRoles(['PLAYER']),
      addToInGame: rules.hasTournamentRoles(['PLAYER']),
      setMatchGameStatus: rules.hasTournamentRoles([
        'HOST',
        'ADMIN',
        'MODERATOR',
        'PLAYER',
      ]),
      createSubmissions: rules.hasTournamentRoles([
        'HOST',
        'ADMIN',
        'MODERATOR',
        'PLAYER',
      ]),
      setTicketAssignee: rules.hasTournamentRoles([
        'HOST',
        'ADMIN',
        'MODERATOR',
      ]),

      closeTicket: rules.hasTournamentRoles(['HOST', 'ADMIN', 'MODERATOR']),

      setMatchWinner: rules.hasTournamentRoles(['HOST', 'ADMIN', 'MODERATOR']),
      resetMatch: rules.hasTournamentRoles(['HOST', 'ADMIN', 'MODERATOR']),
      setTournamentStatus: rules.hasTournamentRoles(['HOST', 'ADMIN']),

      setRoundStatus: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      setStartTime: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      setCheckIn: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      setMatchResults: rules.hasTournamentRoles(['HOST', 'ADMIN', 'MODERATOR']),
      createSavestate: rules.isDevEnvironment(),
      restoreSavestate: rules.isDevEnvironment(),
      deleteSavestate: rules.isDevEnvironment(),
      generateBrackets: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      addParticipant: rules.hasPermissions('tournament.join'),
      removeParticipant: rules.hasPermissions('tournament.join'),
      kickParticipant: rules.hasTournamentRoles(['HOST', 'ADMIN', 'MODERATOR']),
      resolvePlayerReport: rules.hasTournamentRoles([
        'ADMIN',
        'HOST',
        'MODERATOR',
      ]),
      checkinParticipant: rules.hasPermissions('tournament.join'),
      deleteTournament: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      publishBrackets: rules.hasTournamentRoles(['HOST', 'ADMIN']),
      createChatMessage: allow,
    },
    Subscription: {
      tournamentChanged: allow,
      matchChanged: allow,
      ticketChanged: allow,
      chatRoomChanged: allow,
    },
    Image: {
      '*': rules.isAuthenticated,
    },
    User: {
      '*': rules.isUser(),
      id: rules.hasPermissions('tournament.view'),
      displayName: rules.hasPermissions('tournament.view'),
      roles: rules.isAuthenticated,
      linkedAccounts: rules.hasPermissions('tournament.view'),
      gameUsers: rules.hasPermissions('tournament.view'),
      participants: rules.hasPermissions('tournament.view'),
    },
    Game: {
      '*': rules.hasPermissions('tournament.view'),
    },
    GameMode: {
      '*': rules.hasPermissions('tournament.view'),
    },
    GameUser: {
      '*': rules.isAuthenticated,
      inGameName: rules.hasPermissions('tournament.view'),
      elo: rules.hasPermissions('tournament.view'),
      game: rules.hasPermissions('tournament.view'),
      gameId: rules.hasPermissions('tournament.view'),
    },
    UserAccount: {
      '*': rules.isUser('ownerId'),
      id: rules.hasPermissions('tournament.view'),
      username: rules.hasPermissions('tournament.view'),
      avatar: rules.hasPermissions('tournament.view'),
      discriminator: rules.hasPermissions('tournament.view'),
    },
    Tournament: {
      '*': rules.hasPermissions('tournament.view'),
      tickets: rules.hasTournamentRoles(['HOST', 'ADMIN', 'MODERATOR']),
    },
    Participant: {
      '*': rules.hasPermissions('tournament.view'),
    },
    ParticipantRole: {
      '*': rules.hasPermissions('tournament.view'),
    },
    Team: {
      '*': rules.hasPermissions('tournament.view'),
    },
    Region: {
      '*': allow,
    },
    Platform: {
      '*': allow,
    },
    Match: {
      '*': rules.hasPermissions('tournament.view'),
    },
    ReadyCheck: {
      '*': rules.isAuthenticated,
    },
    MatchGame: {
      '*': rules.hasPermissions('tournament.view'),
    },
    Submission: {
      '*': rules.isAuthenticated,
    },
    Result: {
      '*': rules.hasPermissions('tournament.view'),
    },
    Round: {
      '*': rules.hasPermissions('tournament.view'),
    },
    Stage: {
      '*': rules.hasPermissions('tournament.view'),
    },
    Ticket: {
      '*': rules.isAuthenticated,
    },
    Language: {
      '*': allow,
    },
    ChatRoom: {
      '*': allow,
    },
    ChatMessage: {
      '*': allow,
    },
  },
  {
    allowExternalErrors: true,
    debug: process.env.ETY_ENV === 'local',
    fallbackRule: deny,
  }
)
