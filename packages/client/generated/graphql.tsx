import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type AuthInfo = {
  __typename?: 'authInfo';
  authenticated: Scalars['Boolean'];
  expires: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type BestOfInput = {
  bestOf?: InputMaybe<Scalars['Int']>;
  roundId?: InputMaybe<Scalars['String']>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  author: User;
  authorId: Scalars['String'];
  chatRoom: ChatRoom;
  chatRoomId: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  archivedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  members: Array<User>;
  messages: Array<ChatMessage>;
  name: Scalars['String'];
  tournament?: Maybe<Tournament>;
  tournamentId?: Maybe<Scalars['String']>;
};

export type Game = {
  __typename?: 'Game';
  gameUsers: Array<GameUser>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  supported: Scalars['Boolean'];
  title: Scalars['String'];
  tournaments: Array<Tournament>;
  verified: Scalars['Boolean'];
};

export type GameMode = {
  __typename?: 'GameMode';
  id: Scalars['ID'];
  name: Scalars['String'];
  teamSize?: Maybe<Scalars['Int']>;
};

export enum GameStatus {
  Conflict = 'CONFLICT',
  ManualEdit = 'MANUAL_EDIT',
  Success = 'SUCCESS',
  Waiting = 'WAITING'
}

export type GameUser = {
  __typename?: 'GameUser';
  elo: Scalars['Int'];
  game: Game;
  gameId: Scalars['String'];
  id: Scalars['ID'];
  inGameName: Scalars['String'];
  user?: Maybe<User>;
};

export type Image = {
  __typename?: 'Image';
  contentType: Scalars['String'];
  game?: Maybe<Game>;
  id: Scalars['ID'];
  name: Scalars['String'];
  secret: Scalars['String'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  code: Scalars['ID'];
  name: Scalars['String'];
};

export type Match = {
  __typename?: 'Match';
  gameLobbyCode?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inGame: Array<Scalars['String']>;
  matchGames: Array<MatchGame>;
  noShowTimer?: Maybe<Scalars['DateTime']>;
  number: Scalars['Int'];
  opponents: Array<Team>;
  readyChecks: Array<ReadyCheck>;
  round?: Maybe<Round>;
  status: MatchStatus;
  supportLink?: Maybe<Scalars['String']>;
  tickets: Array<Ticket>;
};

export type MatchGame = {
  __typename?: 'MatchGame';
  /** The final, confirmed results of the game */
  finalResults: Array<Maybe<Result>>;
  id: Scalars['ID'];
  match: Match;
  matchId: Scalars['String'];
  number: Scalars['Int'];
  result: Array<Result>;
  status: GameStatus;
  submissions: Array<Submission>;
  /** Returns true if all scores match, false if they don't and null if submissions are missing */
  submissionsEqual?: Maybe<Scalars['Boolean']>;
};

export type MatchResultInput = {
  matchGameId: Scalars['ID'];
  results?: InputMaybe<Array<InputMaybe<ResultCreateInput>>>;
};

export enum MatchStatus {
  Done = 'DONE',
  Error = 'ERROR',
  GamePhase = 'GAME_PHASE',
  NoShow = 'NO_SHOW',
  PrepPhase = 'PREP_PHASE',
  Scheduled = 'SCHEDULED',
  Started = 'STARTED'
}

export type Mutation = {
  __typename?: 'Mutation';
  addLobbyCode?: Maybe<Match>;
  addOpponent: Match;
  addParticipant?: Maybe<Participant>;
  addToInGame?: Maybe<Match>;
  changeStatus: Match;
  checkinParticipant?: Maybe<Participant>;
  closeTicket?: Maybe<Ticket>;
  createChatMessage?: Maybe<ChatMessage>;
  createGame: Game;
  createMatch: Match;
  createMatchGame?: Maybe<MatchGame>;
  createOrUpdateGameUser?: Maybe<GameUser>;
  createReadyCheck?: Maybe<ReadyCheck>;
  /** Create a copy of the entire database */
  createSavestate?: Maybe<Scalars['String']>;
  createSubmissions?: Maybe<Array<Maybe<Submission>>>;
  createSystemTicket: Ticket;
  createTeam?: Maybe<Team>;
  createTicket: Ticket;
  createTournament?: Maybe<Tournament>;
  deleteMatch?: Maybe<Match>;
  /** Delete a database copy */
  deleteSavestate?: Maybe<Scalars['Boolean']>;
  deleteTicket?: Maybe<Ticket>;
  deleteTournament?: Maybe<Tournament>;
  generateBrackets: Array<Array<Array<Maybe<Scalars['String']>>>>;
  kickParticipant?: Maybe<Participant>;
  publishBrackets?: Maybe<Array<Maybe<Round>>>;
  removeOpponent: Match;
  removeParticipant?: Maybe<Participant>;
  resetMatch?: Maybe<Match>;
  resolvePlayerReport?: Maybe<Ticket>;
  /** Restore a database copy */
  restoreSavestate?: Maybe<Scalars['String']>;
  setCheckIn?: Maybe<Tournament>;
  setHideDisclaimer?: Maybe<User>;
  setMatchGameStatus?: Maybe<MatchGame>;
  setMatchResults?: Maybe<Match>;
  setMatchWinner?: Maybe<Match>;
  setRoundStatus?: Maybe<Round>;
  setStartTime?: Maybe<Tournament>;
  setTicketAssignee: Ticket;
  setTournamentStatus?: Maybe<Tournament>;
  setUsername?: Maybe<User>;
  updateElo?: Maybe<GameUser>;
  updateParticipantRoles?: Maybe<Participant>;
  updateSeed?: Maybe<Team>;
  updateTournament?: Maybe<Tournament>;
};


export type MutationAddLobbyCodeArgs = {
  lobbycode: Scalars['String'];
  matchId: Scalars['ID'];
};


export type MutationAddOpponentArgs = {
  matchId: Scalars['ID'];
  teamId: Scalars['ID'];
};


export type MutationAddParticipantArgs = {
  elo?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  requestingMod?: InputMaybe<Scalars['Boolean']>;
  tournamentId: Scalars['ID'];
};


export type MutationAddToInGameArgs = {
  matchId: Scalars['ID'];
};


export type MutationChangeStatusArgs = {
  matchId: Scalars['ID'];
  status: MatchStatus;
};


export type MutationCheckinParticipantArgs = {
  tournamentId: Scalars['ID'];
};


export type MutationCloseTicketArgs = {
  ticketId: Scalars['ID'];
  verdict?: InputMaybe<Scalars['String']>;
};


export type MutationCreateChatMessageArgs = {
  chatRoomId: Scalars['String'];
  content: Scalars['String'];
};


export type MutationCreateGameArgs = {
  homepage?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationCreateMatchArgs = {
  opponentIds: Array<Scalars['ID']>;
  roundId: Scalars['ID'];
};


export type MutationCreateMatchGameArgs = {
  matchId: Scalars['ID'];
};


export type MutationCreateOrUpdateGameUserArgs = {
  elo: Scalars['Int'];
  gameId: Scalars['ID'];
  inGameName: Scalars['String'];
  userId: Scalars['ID'];
};


export type MutationCreateReadyCheckArgs = {
  matchId: Scalars['ID'];
  participantId: Scalars['ID'];
};


export type MutationCreateSavestateArgs = {
  title?: InputMaybe<Scalars['String']>;
};


export type MutationCreateSubmissionsArgs = {
  data?: InputMaybe<Array<SubmissionCreateInput>>;
};


export type MutationCreateSystemTicketArgs = {
  matchBlocked?: InputMaybe<Scalars['Boolean']>;
  matchId?: InputMaybe<Scalars['ID']>;
  message?: InputMaybe<Scalars['String']>;
  reportedId?: InputMaybe<Scalars['ID']>;
  ticketType: TicketType;
  tournamentId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateTeamArgs = {
  name: Scalars['String'];
  participantIds?: InputMaybe<Array<Scalars['ID']>>;
  tournamentId: Scalars['ID'];
};


export type MutationCreateTicketArgs = {
  matchBlocked?: InputMaybe<Scalars['Boolean']>;
  message?: InputMaybe<Scalars['String']>;
  reportedId?: InputMaybe<Scalars['ID']>;
  reporterId: Scalars['ID'];
  ticketType: TicketType;
  tournamentId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateTournamentArgs = {
  data: TournamentCreateInput;
};


export type MutationDeleteMatchArgs = {
  matchId: Scalars['ID'];
};


export type MutationDeleteSavestateArgs = {
  title: Scalars['String'];
};


export type MutationDeleteTicketArgs = {
  ticketId: Scalars['ID'];
};


export type MutationDeleteTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type MutationGenerateBracketsArgs = {
  algorithm: Scalars['String'];
  tournamentId: Scalars['ID'];
};


export type MutationKickParticipantArgs = {
  participantId: Scalars['ID'];
};


export type MutationPublishBracketsArgs = {
  bestOfs: Array<InputMaybe<BestOfInput>>;
  publishInput: Array<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  tournamentId: Scalars['ID'];
};


export type MutationRemoveOpponentArgs = {
  matchId: Scalars['ID'];
  teamId: Scalars['ID'];
};


export type MutationRemoveParticipantArgs = {
  tournamentId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
};


export type MutationResetMatchArgs = {
  matchId: Scalars['ID'];
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
};


export type MutationResolvePlayerReportArgs = {
  participantId: Scalars['ID'];
  ticketId: Scalars['ID'];
  verdict?: InputMaybe<Scalars['String']>;
};


export type MutationRestoreSavestateArgs = {
  title: Scalars['String'];
};


export type MutationSetCheckInArgs = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  tournamentId: Scalars['ID'];
};


export type MutationSetHideDisclaimerArgs = {
  hideDisclaimer: Scalars['Boolean'];
};


export type MutationSetMatchGameStatusArgs = {
  matchGameId: Scalars['ID'];
  status?: InputMaybe<GameStatus>;
};


export type MutationSetMatchResultsArgs = {
  matchGameResults: Array<MatchResultInput>;
  matchId: Scalars['ID'];
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
};


export type MutationSetMatchWinnerArgs = {
  matchId: Scalars['ID'];
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
  winnerId: Scalars['ID'];
};


export type MutationSetRoundStatusArgs = {
  locked?: InputMaybe<Scalars['Boolean']>;
  roundId: Scalars['ID'];
  status?: InputMaybe<RoundStatus>;
};


export type MutationSetStartTimeArgs = {
  startTime?: InputMaybe<Scalars['DateTime']>;
  tournamentId: Scalars['ID'];
};


export type MutationSetTicketAssigneeArgs = {
  assigneeId: Scalars['ID'];
  ticketId: Scalars['ID'];
};


export type MutationSetTournamentStatusArgs = {
  status: TournamentStatus;
  ticketId?: InputMaybe<Scalars['ID']>;
  tournamentId: Scalars['ID'];
  verdict?: InputMaybe<Scalars['String']>;
};


export type MutationSetUsernameArgs = {
  name: Scalars['String'];
};


export type MutationUpdateEloArgs = {
  elo: Scalars['Int'];
  id: Scalars['ID'];
  tournamentId: Scalars['ID'];
};


export type MutationUpdateParticipantRolesArgs = {
  addRoles?: InputMaybe<Array<ParticipantRoleType>>;
  deniedMod?: InputMaybe<Scalars['Boolean']>;
  participantId: Scalars['ID'];
  removeRoles?: InputMaybe<Array<ParticipantRoleType>>;
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateSeedArgs = {
  seed: Scalars['Int'];
  teamId: Scalars['ID'];
};


export type MutationUpdateTournamentArgs = {
  data: TournamentCreateInput;
  tournamentId: Scalars['ID'];
};

export type Participant = {
  __typename?: 'Participant';
  checkedInAt?: Maybe<Scalars['DateTime']>;
  deniedMod: Scalars['Boolean'];
  id: Scalars['ID'];
  isCheckedIn?: Maybe<Scalars['Boolean']>;
  isCreator?: Maybe<Scalars['Boolean']>;
  isCurrentUser?: Maybe<Scalars['Boolean']>;
  isHost?: Maybe<Scalars['Boolean']>;
  isModerator?: Maybe<Scalars['Boolean']>;
  isPlayer?: Maybe<Scalars['Boolean']>;
  isReady?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  kicked: Scalars['Boolean'];
  readyChecks: Array<ReadyCheck>;
  registeredAt?: Maybe<Scalars['DateTime']>;
  requestingMod: Scalars['Boolean'];
  roles: Array<ParticipantRole>;
  team?: Maybe<Team>;
  teamId?: Maybe<Scalars['String']>;
  tournament?: Maybe<Tournament>;
  tournamentId?: Maybe<Scalars['String']>;
  user: User;
  userId: Scalars['String'];
};


export type ParticipantIsCreatorArgs = {
  matchId: Scalars['ID'];
};


export type ParticipantIsReadyArgs = {
  matchId: Scalars['ID'];
};

export type ParticipantRole = {
  __typename?: 'ParticipantRole';
  id: Scalars['ID'];
  participant: Participant;
  participantId: Scalars['String'];
  type: ParticipantRoleType;
};

export enum ParticipantRoleType {
  Admin = 'ADMIN',
  Host = 'HOST',
  Moderator = 'MODERATOR',
  Player = 'PLAYER'
}

export type Platform = {
  __typename?: 'Platform';
  code: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  authInfo: AuthInfo;
  chatRoomMessages: Array<ChatMessage>;
  games: Array<Game>;
  gameUsers?: Maybe<Array<Maybe<GameUser>>>;
  isCheckedIn?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  languages?: Maybe<Array<Maybe<Language>>>;
  match?: Maybe<Match>;
  matchesInTournament: Array<Match>;
  me?: Maybe<User>;
  participants: Array<Participant>;
  participantsFromTournament: Array<Participant>;
  platforms: Array<Platform>;
  playersFromTournament: Array<Participant>;
  regions: Array<Region>;
  relatedChatRooms: Array<ChatRoom>;
  relatedTickets?: Maybe<Array<Ticket>>;
  savestates: Array<Scalars['String']>;
  staffFromTournament: Array<Participant>;
  team?: Maybe<Team>;
  tickets?: Maybe<Array<Maybe<Ticket>>>;
  tournament?: Maybe<Tournament>;
  tournaments?: Maybe<Array<Maybe<Tournament>>>;
  tournamentStages: Array<Stage>;
  tournamentTickets: Array<Ticket>;
  user?: Maybe<User>;
  userAccounts?: Maybe<Array<Maybe<UserAccount>>>;
  userParticipants?: Maybe<Array<Maybe<Participant>>>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryChatRoomMessagesArgs = {
  chatRoomId: Scalars['ID'];
};


export type QueryIsCheckedInArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryIsRegisteredArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryMatchArgs = {
  matchId: Scalars['ID'];
};


export type QueryMatchesInTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryParticipantsFromTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryPlayersFromTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryStaffFromTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryTeamArgs = {
  teamId: Scalars['ID'];
};


export type QueryTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryTournamentsArgs = {
  userHasParticipantRoles?: InputMaybe<Array<ParticipantRoleType>>;
};


export type QueryTournamentStagesArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryTournamentTicketsArgs = {
  tournamentId: Scalars['ID'];
};


export type QueryUserArgs = {
  userId: Scalars['ID'];
};

export type ReadyCheck = {
  __typename?: 'ReadyCheck';
  checkedInAt: Scalars['DateTime'];
  id: Scalars['ID'];
  lobbyRole: Scalars['String'];
  match: Match;
  matchId: Scalars['String'];
  participant: Participant;
};

export type Region = {
  __typename?: 'Region';
  code: Scalars['ID'];
  name: Scalars['String'];
};

export type Result = {
  __typename?: 'Result';
  id: Scalars['ID'];
  score: Scalars['Int'];
  submission?: Maybe<Submission>;
  submissionId?: Maybe<Scalars['String']>;
  team: Team;
  teamId: Scalars['String'];
};

export type ResultCreateInput = {
  score: Scalars['Int'];
  teamId: Scalars['ID'];
};

export type Round = {
  __typename?: 'Round';
  completedMatches: Scalars['Int'];
  format: Scalars['Int'];
  id: Scalars['ID'];
  locked: Scalars['Boolean'];
  matches: Array<Match>;
  number: Scalars['Int'];
  playersInRound?: Maybe<Scalars['Int']>;
  stage?: Maybe<Stage>;
  stageId?: Maybe<Scalars['String']>;
  status: RoundStatus;
  title?: Maybe<Scalars['String']>;
};

export enum RoundStatus {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Upcoming = 'UPCOMING'
}

export type Stage = {
  __typename?: 'Stage';
  id: Scalars['ID'];
  number: Scalars['Int'];
  rounds: Array<Round>;
  title?: Maybe<Scalars['String']>;
  tournament: Tournament;
  tournamentId: Scalars['String'];
  type: StageType;
};

export enum StageType {
  Single = 'SINGLE'
}

export type Submission = {
  __typename?: 'Submission';
  id: Scalars['ID'];
  matchGame?: Maybe<MatchGame>;
  matchGameId?: Maybe<Scalars['String']>;
  resubmitted: Scalars['Boolean'];
  results: Array<Result>;
  team: Team;
  teamId: Scalars['String'];
};

export type SubmissionCreateInput = {
  matchGameId: Scalars['ID'];
  number?: InputMaybe<Scalars['Int']>;
  results: Array<ResultCreateInput>;
  teamId: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  chatRoomChanged?: Maybe<ChatRoom>;
  matchChanged?: Maybe<Match>;
  ticketChanged?: Maybe<Ticket>;
  tournamentChanged?: Maybe<Tournament>;
};


export type SubscriptionChatRoomChangedArgs = {
  actions?: InputMaybe<Array<Scalars['String']>>;
  chatRoomId: Scalars['ID'];
};


export type SubscriptionMatchChangedArgs = {
  actions?: InputMaybe<Array<Scalars['String']>>;
  matchId: Scalars['ID'];
};


export type SubscriptionTicketChangedArgs = {
  actions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ticketId?: InputMaybe<Scalars['ID']>;
  tournamentId?: InputMaybe<Scalars['ID']>;
};


export type SubscriptionTournamentChangedArgs = {
  actions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tournamentId: Scalars['ID'];
};

export type Team = {
  __typename?: 'Team';
  allScoresSubmitted?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['String']>;
  averageElo?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  kicked?: Maybe<Scalars['Boolean']>;
  leader?: Maybe<Participant>;
  leaderId?: Maybe<Scalars['String']>;
  matches: Array<Match>;
  name: Scalars['String'];
  participants: Array<Participant>;
  participantsReady?: Maybe<Scalars['Int']>;
  readyChecks: Array<ReadyCheck>;
  seed?: Maybe<Scalars['Int']>;
};


export type TeamAllScoresSubmittedArgs = {
  matchId: Scalars['ID'];
};


export type TeamParticipantsReadyArgs = {
  matchId: Scalars['ID'];
};

export type Ticket = {
  __typename?: 'Ticket';
  assignee?: Maybe<User>;
  id: Scalars['ID'];
  match?: Maybe<Match>;
  matchBlocked?: Maybe<Scalars['Boolean']>;
  matchId?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
  reported?: Maybe<User>;
  reporter?: Maybe<User>;
  resolved: Scalars['Boolean'];
  tournament?: Maybe<Tournament>;
  tournamentId?: Maybe<Scalars['String']>;
  type: TicketType;
  verdict?: Maybe<Scalars['String']>;
};

export enum TicketType {
  GameIssue = 'GAME_ISSUE',
  PlayerNotResponding = 'PLAYER_NOT_RESPONDING',
  PlayerReport = 'PLAYER_REPORT',
  ScoreConflict = 'SCORE_CONFLICT',
  SiteIssue = 'SITE_ISSUE'
}

export type Tournament = {
  __typename?: 'Tournament';
  activeRound?: Maybe<Round>;
  chatRoom?: Maybe<ChatRoom>;
  checkinEnd?: Maybe<Scalars['DateTime']>;
  checkinStart?: Maybe<Scalars['DateTime']>;
  completedRounds: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  discordLink?: Maybe<Scalars['String']>;
  game: Game;
  gameId: Scalars['String'];
  gameMode: GameMode;
  gameModeId: Scalars['String'];
  gameUser?: Maybe<GameUser>;
  hostUser: User;
  id: Scalars['ID'];
  language?: Maybe<Language>;
  maxPlayers?: Maybe<Scalars['Int']>;
  noShow: Scalars['Int'];
  participants: Array<Participant>;
  platforms: Array<Platform>;
  players?: Maybe<Array<Maybe<Participant>>>;
  playersCount?: Maybe<Scalars['Int']>;
  prizePool?: Maybe<Scalars['String']>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  region?: Maybe<Region>;
  roundsCount?: Maybe<Scalars['Int']>;
  rules: Scalars['String'];
  staff?: Maybe<Array<Maybe<Participant>>>;
  staffCount?: Maybe<Scalars['Int']>;
  stages: Array<Stage>;
  status: TournamentStatus;
  streamLink?: Maybe<Scalars['String']>;
  supportLink?: Maybe<Scalars['String']>;
  tickets: Array<Ticket>;
  title: Scalars['String'];
  unassignedTickets?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
  userRoles?: Maybe<Array<ParticipantRoleType>>;
  /** Returns the team, that won the last match of the tournament (if possible) or null. Match counts as won if the combined scores are higher than (round.format/2) */
  winnerTeam?: Maybe<Team>;
};

export type TournamentCreateInput = {
  checkinEnd?: InputMaybe<Scalars['DateTime']>;
  checkinStart?: InputMaybe<Scalars['DateTime']>;
  date: Scalars['DateTime'];
  description: Scalars['String'];
  gameId: Scalars['String'];
  gameModeId: Scalars['ID'];
  language?: InputMaybe<Scalars['ID']>;
  maxPlayers: Scalars['Int'];
  noShow: Scalars['Int'];
  platforms: Array<Scalars['ID']>;
  prizePool?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['ID']>;
  rules: Scalars['String'];
  streamLink?: InputMaybe<Scalars['String']>;
  supportLink?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  type: StageType;
};

export enum TournamentStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Error = 'ERROR',
  Finished = 'FINISHED',
  Published = 'PUBLISHED',
  Started = 'STARTED'
}

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  currentHost?: Maybe<Participant>;
  currentMatch?: Maybe<Match>;
  currentParticipant?: Maybe<Participant>;
  displayName: Scalars['String'];
  gameUserFromTournament?: Maybe<GameUser>;
  gameUsers: Array<GameUser>;
  hideAlphaDisclaimer: Scalars['Boolean'];
  id: Scalars['ID'];
  linkedAccounts: Array<UserAccount>;
  participantFromTournament?: Maybe<Participant>;
  participants: Array<Participant>;
  permissions: Array<Scalars['String']>;
  roles: Array<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};


export type UserGameUserFromTournamentArgs = {
  tournamentId: Scalars['ID'];
};


export type UserParticipantFromTournamentArgs = {
  tournamentId: Scalars['ID'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  accessToken: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  discriminator: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  fetchedAt: Scalars['String'];
  id: Scalars['ID'];
  locale: Scalars['String'];
  mfaEnabled: Scalars['Boolean'];
  owner: User;
  provider: Scalars['String'];
  refreshToken: Scalars['String'];
  userId: Scalars['String'];
  username: Scalars['String'];
  verified: Scalars['Boolean'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  authInfo: ResolverTypeWrapper<AuthInfo>;
  BestOfInput: BestOfInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ChatMessage: ResolverTypeWrapper<ChatMessage>;
  ChatRoom: ResolverTypeWrapper<ChatRoom>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Game: ResolverTypeWrapper<Game>;
  GameMode: ResolverTypeWrapper<GameMode>;
  GameStatus: GameStatus;
  GameUser: ResolverTypeWrapper<GameUser>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Language: ResolverTypeWrapper<Language>;
  Match: ResolverTypeWrapper<Match>;
  MatchGame: ResolverTypeWrapper<MatchGame>;
  MatchResultInput: MatchResultInput;
  MatchStatus: MatchStatus;
  Mutation: ResolverTypeWrapper<{}>;
  Participant: ResolverTypeWrapper<Participant>;
  ParticipantRole: ResolverTypeWrapper<ParticipantRole>;
  ParticipantRoleType: ParticipantRoleType;
  Platform: ResolverTypeWrapper<Platform>;
  Query: ResolverTypeWrapper<{}>;
  ReadyCheck: ResolverTypeWrapper<ReadyCheck>;
  Region: ResolverTypeWrapper<Region>;
  Result: ResolverTypeWrapper<Result>;
  ResultCreateInput: ResultCreateInput;
  Round: ResolverTypeWrapper<Round>;
  RoundStatus: RoundStatus;
  Stage: ResolverTypeWrapper<Stage>;
  StageType: StageType;
  String: ResolverTypeWrapper<Scalars['String']>;
  Submission: ResolverTypeWrapper<Submission>;
  SubmissionCreateInput: SubmissionCreateInput;
  Subscription: ResolverTypeWrapper<{}>;
  Team: ResolverTypeWrapper<Team>;
  Ticket: ResolverTypeWrapper<Ticket>;
  TicketType: TicketType;
  Tournament: ResolverTypeWrapper<Tournament>;
  TournamentCreateInput: TournamentCreateInput;
  TournamentStatus: TournamentStatus;
  User: ResolverTypeWrapper<User>;
  UserAccount: ResolverTypeWrapper<UserAccount>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  authInfo: AuthInfo;
  BestOfInput: BestOfInput;
  Boolean: Scalars['Boolean'];
  ChatMessage: ChatMessage;
  ChatRoom: ChatRoom;
  DateTime: Scalars['DateTime'];
  Float: Scalars['Float'];
  Game: Game;
  GameMode: GameMode;
  GameUser: GameUser;
  ID: Scalars['ID'];
  Image: Image;
  Int: Scalars['Int'];
  Language: Language;
  Match: Match;
  MatchGame: MatchGame;
  MatchResultInput: MatchResultInput;
  Mutation: {};
  Participant: Participant;
  ParticipantRole: ParticipantRole;
  Platform: Platform;
  Query: {};
  ReadyCheck: ReadyCheck;
  Region: Region;
  Result: Result;
  ResultCreateInput: ResultCreateInput;
  Round: Round;
  Stage: Stage;
  String: Scalars['String'];
  Submission: Submission;
  SubmissionCreateInput: SubmissionCreateInput;
  Subscription: {};
  Team: Team;
  Ticket: Ticket;
  Tournament: Tournament;
  TournamentCreateInput: TournamentCreateInput;
  User: User;
  UserAccount: UserAccount;
};

export type AuthInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['authInfo'] = ResolversParentTypes['authInfo']> = {
  authenticated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expires?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatMessage'] = ResolversParentTypes['ChatMessage']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chatRoom?: Resolver<ResolversTypes['ChatRoom'], ParentType, ContextType>;
  chatRoomId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChatRoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatRoom'] = ResolversParentTypes['ChatRoom']> = {
  archivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  messages?: Resolver<Array<ResolversTypes['ChatMessage']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType>;
  tournamentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  gameUsers?: Resolver<Array<ResolversTypes['GameUser']>, ParentType, ContextType>;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  supported?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tournaments?: Resolver<Array<ResolversTypes['Tournament']>, ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameModeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameMode'] = ResolversParentTypes['GameMode']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameUser'] = ResolversParentTypes['GameUser']> = {
  elo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  gameId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inGameName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  game?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secret?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  code?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Match'] = ResolversParentTypes['Match']> = {
  gameLobbyCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inGame?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  matchGames?: Resolver<Array<ResolversTypes['MatchGame']>, ParentType, ContextType>;
  noShowTimer?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  opponents?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  readyChecks?: Resolver<Array<ResolversTypes['ReadyCheck']>, ParentType, ContextType>;
  round?: Resolver<Maybe<ResolversTypes['Round']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MatchStatus'], ParentType, ContextType>;
  supportLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tickets?: Resolver<Array<ResolversTypes['Ticket']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchGameResolvers<ContextType = any, ParentType extends ResolversParentTypes['MatchGame'] = ResolversParentTypes['MatchGame']> = {
  finalResults?: Resolver<Array<Maybe<ResolversTypes['Result']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  match?: Resolver<ResolversTypes['Match'], ParentType, ContextType>;
  matchId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  result?: Resolver<Array<ResolversTypes['Result']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['GameStatus'], ParentType, ContextType>;
  submissions?: Resolver<Array<ResolversTypes['Submission']>, ParentType, ContextType>;
  submissionsEqual?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addLobbyCode?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<MutationAddLobbyCodeArgs, 'lobbycode' | 'matchId'>>;
  addOpponent?: Resolver<ResolversTypes['Match'], ParentType, ContextType, RequireFields<MutationAddOpponentArgs, 'matchId' | 'teamId'>>;
  addParticipant?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<MutationAddParticipantArgs, 'tournamentId'>>;
  addToInGame?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<MutationAddToInGameArgs, 'matchId'>>;
  changeStatus?: Resolver<ResolversTypes['Match'], ParentType, ContextType, RequireFields<MutationChangeStatusArgs, 'matchId' | 'status'>>;
  checkinParticipant?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<MutationCheckinParticipantArgs, 'tournamentId'>>;
  closeTicket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType, RequireFields<MutationCloseTicketArgs, 'ticketId'>>;
  createChatMessage?: Resolver<Maybe<ResolversTypes['ChatMessage']>, ParentType, ContextType, RequireFields<MutationCreateChatMessageArgs, 'chatRoomId' | 'content'>>;
  createGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationCreateGameArgs, 'title'>>;
  createMatch?: Resolver<ResolversTypes['Match'], ParentType, ContextType, RequireFields<MutationCreateMatchArgs, 'opponentIds' | 'roundId'>>;
  createMatchGame?: Resolver<Maybe<ResolversTypes['MatchGame']>, ParentType, ContextType, RequireFields<MutationCreateMatchGameArgs, 'matchId'>>;
  createOrUpdateGameUser?: Resolver<Maybe<ResolversTypes['GameUser']>, ParentType, ContextType, RequireFields<MutationCreateOrUpdateGameUserArgs, 'elo' | 'gameId' | 'inGameName' | 'userId'>>;
  createReadyCheck?: Resolver<Maybe<ResolversTypes['ReadyCheck']>, ParentType, ContextType, RequireFields<MutationCreateReadyCheckArgs, 'matchId' | 'participantId'>>;
  createSavestate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationCreateSavestateArgs>>;
  createSubmissions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Submission']>>>, ParentType, ContextType, Partial<MutationCreateSubmissionsArgs>>;
  createSystemTicket?: Resolver<ResolversTypes['Ticket'], ParentType, ContextType, RequireFields<MutationCreateSystemTicketArgs, 'ticketType'>>;
  createTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<MutationCreateTeamArgs, 'name' | 'tournamentId'>>;
  createTicket?: Resolver<ResolversTypes['Ticket'], ParentType, ContextType, RequireFields<MutationCreateTicketArgs, 'reporterId' | 'ticketType'>>;
  createTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationCreateTournamentArgs, 'data'>>;
  deleteMatch?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<MutationDeleteMatchArgs, 'matchId'>>;
  deleteSavestate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteSavestateArgs, 'title'>>;
  deleteTicket?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType, RequireFields<MutationDeleteTicketArgs, 'ticketId'>>;
  deleteTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationDeleteTournamentArgs, 'tournamentId'>>;
  generateBrackets?: Resolver<Array<Array<Array<Maybe<ResolversTypes['String']>>>>, ParentType, ContextType, RequireFields<MutationGenerateBracketsArgs, 'algorithm' | 'tournamentId'>>;
  kickParticipant?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<MutationKickParticipantArgs, 'participantId'>>;
  publishBrackets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Round']>>>, ParentType, ContextType, RequireFields<MutationPublishBracketsArgs, 'bestOfs' | 'publishInput' | 'tournamentId'>>;
  removeOpponent?: Resolver<ResolversTypes['Match'], ParentType, ContextType, RequireFields<MutationRemoveOpponentArgs, 'matchId' | 'teamId'>>;
  removeParticipant?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<MutationRemoveParticipantArgs, 'tournamentId'>>;
  resetMatch?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<MutationResetMatchArgs, 'matchId'>>;
  resolvePlayerReport?: Resolver<Maybe<ResolversTypes['Ticket']>, ParentType, ContextType, RequireFields<MutationResolvePlayerReportArgs, 'participantId' | 'ticketId'>>;
  restoreSavestate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationRestoreSavestateArgs, 'title'>>;
  setCheckIn?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationSetCheckInArgs, 'tournamentId'>>;
  setHideDisclaimer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSetHideDisclaimerArgs, 'hideDisclaimer'>>;
  setMatchGameStatus?: Resolver<Maybe<ResolversTypes['MatchGame']>, ParentType, ContextType, RequireFields<MutationSetMatchGameStatusArgs, 'matchGameId'>>;
  setMatchResults?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<MutationSetMatchResultsArgs, 'matchGameResults' | 'matchId'>>;
  setMatchWinner?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<MutationSetMatchWinnerArgs, 'matchId' | 'winnerId'>>;
  setRoundStatus?: Resolver<Maybe<ResolversTypes['Round']>, ParentType, ContextType, RequireFields<MutationSetRoundStatusArgs, 'roundId'>>;
  setStartTime?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationSetStartTimeArgs, 'tournamentId'>>;
  setTicketAssignee?: Resolver<ResolversTypes['Ticket'], ParentType, ContextType, RequireFields<MutationSetTicketAssigneeArgs, 'assigneeId' | 'ticketId'>>;
  setTournamentStatus?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationSetTournamentStatusArgs, 'status' | 'tournamentId'>>;
  setUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSetUsernameArgs, 'name'>>;
  updateElo?: Resolver<Maybe<ResolversTypes['GameUser']>, ParentType, ContextType, RequireFields<MutationUpdateEloArgs, 'elo' | 'id' | 'tournamentId'>>;
  updateParticipantRoles?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<MutationUpdateParticipantRolesArgs, 'participantId'>>;
  updateSeed?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<MutationUpdateSeedArgs, 'seed' | 'teamId'>>;
  updateTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationUpdateTournamentArgs, 'data' | 'tournamentId'>>;
};

export type ParticipantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Participant'] = ResolversParentTypes['Participant']> = {
  checkedInAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deniedMod?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCheckedIn?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isCreator?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<ParticipantIsCreatorArgs, 'matchId'>>;
  isCurrentUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isHost?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isModerator?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPlayer?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isReady?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<ParticipantIsReadyArgs, 'matchId'>>;
  isRegistered?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  kicked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  readyChecks?: Resolver<Array<ResolversTypes['ReadyCheck']>, ParentType, ContextType>;
  registeredAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  requestingMod?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['ParticipantRole']>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType>;
  tournamentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParticipantRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParticipantRole'] = ResolversParentTypes['ParticipantRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  participant?: Resolver<ResolversTypes['Participant'], ParentType, ContextType>;
  participantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ParticipantRoleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlatformResolvers<ContextType = any, ParentType extends ResolversParentTypes['Platform'] = ResolversParentTypes['Platform']> = {
  code?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authInfo?: Resolver<ResolversTypes['authInfo'], ParentType, ContextType>;
  chatRoomMessages?: Resolver<Array<ResolversTypes['ChatMessage']>, ParentType, ContextType, RequireFields<QueryChatRoomMessagesArgs, 'chatRoomId'>>;
  games?: Resolver<Array<ResolversTypes['Game']>, ParentType, ContextType>;
  gameUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['GameUser']>>>, ParentType, ContextType>;
  isCheckedIn?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<QueryIsCheckedInArgs, 'tournamentId'>>;
  isRegistered?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<QueryIsRegisteredArgs, 'tournamentId'>>;
  languages?: Resolver<Maybe<Array<Maybe<ResolversTypes['Language']>>>, ParentType, ContextType>;
  match?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<QueryMatchArgs, 'matchId'>>;
  matchesInTournament?: Resolver<Array<ResolversTypes['Match']>, ParentType, ContextType, RequireFields<QueryMatchesInTournamentArgs, 'tournamentId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType>;
  participantsFromTournament?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<QueryParticipantsFromTournamentArgs, 'tournamentId'>>;
  platforms?: Resolver<Array<ResolversTypes['Platform']>, ParentType, ContextType>;
  playersFromTournament?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<QueryPlayersFromTournamentArgs, 'tournamentId'>>;
  regions?: Resolver<Array<ResolversTypes['Region']>, ParentType, ContextType>;
  relatedChatRooms?: Resolver<Array<ResolversTypes['ChatRoom']>, ParentType, ContextType>;
  relatedTickets?: Resolver<Maybe<Array<ResolversTypes['Ticket']>>, ParentType, ContextType>;
  savestates?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  staffFromTournament?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<QueryStaffFromTournamentArgs, 'tournamentId'>>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'teamId'>>;
  tickets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Ticket']>>>, ParentType, ContextType>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<QueryTournamentArgs, 'tournamentId'>>;
  tournaments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tournament']>>>, ParentType, ContextType, Partial<QueryTournamentsArgs>>;
  tournamentStages?: Resolver<Array<ResolversTypes['Stage']>, ParentType, ContextType, RequireFields<QueryTournamentStagesArgs, 'tournamentId'>>;
  tournamentTickets?: Resolver<Array<ResolversTypes['Ticket']>, ParentType, ContextType, RequireFields<QueryTournamentTicketsArgs, 'tournamentId'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userId'>>;
  userAccounts?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserAccount']>>>, ParentType, ContextType>;
  userParticipants?: Resolver<Maybe<Array<Maybe<ResolversTypes['Participant']>>>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type ReadyCheckResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReadyCheck'] = ResolversParentTypes['ReadyCheck']> = {
  checkedInAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lobbyRole?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  match?: Resolver<ResolversTypes['Match'], ParentType, ContextType>;
  matchId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  participant?: Resolver<ResolversTypes['Participant'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']> = {
  code?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  submission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType>;
  submissionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoundResolvers<ContextType = any, ParentType extends ResolversParentTypes['Round'] = ResolversParentTypes['Round']> = {
  completedMatches?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  format?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  matches?: Resolver<Array<ResolversTypes['Match']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  playersInRound?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stage?: Resolver<Maybe<ResolversTypes['Stage']>, ParentType, ContextType>;
  stageId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RoundStatus'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Stage'] = ResolversParentTypes['Stage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rounds?: Resolver<Array<ResolversTypes['Round']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tournament?: Resolver<ResolversTypes['Tournament'], ParentType, ContextType>;
  tournamentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StageType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submission'] = ResolversParentTypes['Submission']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  matchGame?: Resolver<Maybe<ResolversTypes['MatchGame']>, ParentType, ContextType>;
  matchGameId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resubmitted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['Result']>, ParentType, ContextType>;
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  chatRoomChanged?: SubscriptionResolver<Maybe<ResolversTypes['ChatRoom']>, "chatRoomChanged", ParentType, ContextType, RequireFields<SubscriptionChatRoomChangedArgs, 'chatRoomId'>>;
  matchChanged?: SubscriptionResolver<Maybe<ResolversTypes['Match']>, "matchChanged", ParentType, ContextType, RequireFields<SubscriptionMatchChangedArgs, 'matchId'>>;
  ticketChanged?: SubscriptionResolver<Maybe<ResolversTypes['Ticket']>, "ticketChanged", ParentType, ContextType, Partial<SubscriptionTicketChangedArgs>>;
  tournamentChanged?: SubscriptionResolver<Maybe<ResolversTypes['Tournament']>, "tournamentChanged", ParentType, ContextType, RequireFields<SubscriptionTournamentChangedArgs, 'tournamentId'>>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  allScoresSubmitted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<TeamAllScoresSubmittedArgs, 'matchId'>>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  averageElo?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kicked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  leader?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType>;
  leaderId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  matches?: Resolver<Array<ResolversTypes['Match']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType>;
  participantsReady?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<TeamParticipantsReadyArgs, 'matchId'>>;
  readyChecks?: Resolver<Array<ResolversTypes['ReadyCheck']>, ParentType, ContextType>;
  seed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TicketResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ticket'] = ResolversParentTypes['Ticket']> = {
  assignee?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  match?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType>;
  matchBlocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  matchId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  reported?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  reporter?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  resolved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType>;
  tournamentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TicketType'], ParentType, ContextType>;
  verdict?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TournamentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tournament'] = ResolversParentTypes['Tournament']> = {
  activeRound?: Resolver<Maybe<ResolversTypes['Round']>, ParentType, ContextType>;
  chatRoom?: Resolver<Maybe<ResolversTypes['ChatRoom']>, ParentType, ContextType>;
  checkinEnd?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  checkinStart?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  completedRounds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType>;
  gameId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gameMode?: Resolver<ResolversTypes['GameMode'], ParentType, ContextType>;
  gameModeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gameUser?: Resolver<Maybe<ResolversTypes['GameUser']>, ParentType, ContextType>;
  hostUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType>;
  maxPlayers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  noShow?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  participants?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType>;
  platforms?: Resolver<Array<ResolversTypes['Platform']>, ParentType, ContextType>;
  players?: Resolver<Maybe<Array<Maybe<ResolversTypes['Participant']>>>, ParentType, ContextType>;
  playersCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  prizePool?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publishedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
  roundsCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  rules?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  staff?: Resolver<Maybe<Array<Maybe<ResolversTypes['Participant']>>>, ParentType, ContextType>;
  staffCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stages?: Resolver<Array<ResolversTypes['Stage']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TournamentStatus'], ParentType, ContextType>;
  streamLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supportLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tickets?: Resolver<Array<ResolversTypes['Ticket']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unassignedTickets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userRoles?: Resolver<Maybe<Array<ResolversTypes['ParticipantRoleType']>>, ParentType, ContextType>;
  winnerTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentHost?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType>;
  currentMatch?: Resolver<Maybe<ResolversTypes['Match']>, ParentType, ContextType>;
  currentParticipant?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gameUserFromTournament?: Resolver<Maybe<ResolversTypes['GameUser']>, ParentType, ContextType, RequireFields<UserGameUserFromTournamentArgs, 'tournamentId'>>;
  gameUsers?: Resolver<Array<ResolversTypes['GameUser']>, ParentType, ContextType>;
  hideAlphaDisclaimer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  linkedAccounts?: Resolver<Array<ResolversTypes['UserAccount']>, ParentType, ContextType>;
  participantFromTournament?: Resolver<Maybe<ResolversTypes['Participant']>, ParentType, ContextType, RequireFields<UserParticipantFromTournamentArgs, 'tournamentId'>>;
  participants?: Resolver<Array<ResolversTypes['Participant']>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAccount'] = ResolversParentTypes['UserAccount']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discriminator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fetchedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  locale?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mfaEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  authInfo?: AuthInfoResolvers<ContextType>;
  ChatMessage?: ChatMessageResolvers<ContextType>;
  ChatRoom?: ChatRoomResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Game?: GameResolvers<ContextType>;
  GameMode?: GameModeResolvers<ContextType>;
  GameUser?: GameUserResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  Match?: MatchResolvers<ContextType>;
  MatchGame?: MatchGameResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Participant?: ParticipantResolvers<ContextType>;
  ParticipantRole?: ParticipantRoleResolvers<ContextType>;
  Platform?: PlatformResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReadyCheck?: ReadyCheckResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  Round?: RoundResolvers<ContextType>;
  Stage?: StageResolvers<ContextType>;
  Submission?: SubmissionResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Ticket?: TicketResolvers<ContextType>;
  Tournament?: TournamentResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserAccount?: UserAccountResolvers<ContextType>;
};


export type GetUserDetailsQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetUserDetailsQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', userId: string, avatar?: string | null }> } | null };

export type CreateSavestateMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']>;
}>;


export type CreateSavestateMutation = { __typename?: 'Mutation', createSavestate?: string | null };

export type RestoreSavestateMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type RestoreSavestateMutation = { __typename?: 'Mutation', restoreSavestate?: string | null };

export type DeleteSavestateMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type DeleteSavestateMutation = { __typename?: 'Mutation', deleteSavestate?: boolean | null };

export type GetSavestatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSavestatesQuery = { __typename?: 'Query', savestates: Array<string> };

export type AddParticipantMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  requestingMod?: InputMaybe<Scalars['Boolean']>;
  elo?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type AddParticipantMutation = { __typename?: 'Mutation', addParticipant?: { __typename?: 'Participant', id: string, isCheckedIn?: boolean | null, isRegistered?: boolean | null, isPlayer?: boolean | null, isHost?: boolean | null, isCurrentUser?: boolean | null, requestingMod: boolean, deniedMod: boolean, kicked: boolean, team?: { __typename?: 'Team', id: string, seed?: number | null } | null, roles: Array<{ __typename?: 'ParticipantRole', type: ParticipantRoleType }>, user: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null }>, gameUsers: Array<{ __typename?: 'GameUser', inGameName: string, elo: number, gameId: string }> } } | null };

export type CheckinParticipantMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type CheckinParticipantMutation = { __typename?: 'Mutation', checkinParticipant?: { __typename?: 'Participant', id: string, isCheckedIn?: boolean | null } | null };

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = { __typename?: 'Query', languages?: Array<{ __typename?: 'Language', code: string, name: string } | null> | null };

export type GetRegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRegionsQuery = { __typename?: 'Query', regions: Array<{ __typename?: 'Region', code: string, name: string }> };

export type SetAssigneeMutationVariables = Exact<{
  ticketId: Scalars['ID'];
  assigneeId: Scalars['ID'];
}>;


export type SetAssigneeMutation = { __typename?: 'Mutation', setTicketAssignee: { __typename?: 'Ticket', id: string, assignee?: { __typename?: 'User', id: string, displayName: string } | null } };

export type UpdateGameUserEloMutationVariables = Exact<{
  id: Scalars['ID'];
  elo: Scalars['Int'];
  tournamentId: Scalars['ID'];
}>;


export type UpdateGameUserEloMutation = { __typename?: 'Mutation', updateElo?: { __typename?: 'GameUser', id: string, elo: number } | null };

export type UpdateSeedMutationVariables = Exact<{
  teamId: Scalars['ID'];
  seed: Scalars['Int'];
}>;


export type UpdateSeedMutation = { __typename?: 'Mutation', updateSeed?: { __typename?: 'Team', id: string, seed?: number | null } | null };

export type UpdateParticipantRolesMutationVariables = Exact<{
  participantId: Scalars['ID'];
  addRoles?: InputMaybe<Array<ParticipantRoleType> | ParticipantRoleType>;
  removeRoles?: InputMaybe<Array<ParticipantRoleType> | ParticipantRoleType>;
  deniedMod?: InputMaybe<Scalars['Boolean']>;
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type UpdateParticipantRolesMutation = { __typename?: 'Mutation', updateParticipantRoles?: { __typename?: 'Participant', id: string, isCheckedIn?: boolean | null, isRegistered?: boolean | null, isPlayer?: boolean | null, isHost?: boolean | null, isCurrentUser?: boolean | null, requestingMod: boolean, deniedMod: boolean, kicked: boolean, roles: Array<{ __typename?: 'ParticipantRole', type: ParticipantRoleType }> } | null };

export type KickParticipantMutationVariables = Exact<{
  participantId: Scalars['ID'];
}>;


export type KickParticipantMutation = { __typename?: 'Mutation', kickParticipant?: { __typename?: 'Participant', id: string, isCheckedIn?: boolean | null, isRegistered?: boolean | null, isPlayer?: boolean | null, isHost?: boolean | null, isCurrentUser?: boolean | null, requestingMod: boolean, deniedMod: boolean, kicked: boolean, roles: Array<{ __typename?: 'ParticipantRole', type: ParticipantRoleType }> } | null };

export type CreateReadyCheckMutationVariables = Exact<{
  matchId: Scalars['ID'];
  participantId: Scalars['ID'];
}>;


export type CreateReadyCheckMutation = { __typename?: 'Mutation', createReadyCheck?: { __typename?: 'ReadyCheck', id: string, participant: { __typename?: 'Participant', id: string, isCreator?: boolean | null, isReady?: boolean | null }, match: { __typename?: 'Match', id: string, readyChecks: Array<{ __typename?: 'ReadyCheck', id: string }> } } | null };

export type ChangeStatusMutationVariables = Exact<{
  matchId: Scalars['ID'];
  status: MatchStatus;
}>;


export type ChangeStatusMutation = { __typename?: 'Mutation', changeStatus: { __typename?: 'Match', id: string, status: MatchStatus } };

export type CreateSystemTicketMutationVariables = Exact<{
  matchId: Scalars['ID'];
  ticketType: TicketType;
  reportedId?: InputMaybe<Scalars['ID']>;
  message?: InputMaybe<Scalars['String']>;
  matchBlocked?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateSystemTicketMutation = { __typename?: 'Mutation', createSystemTicket: { __typename?: 'Ticket', id: string, type: TicketType, message?: string | null, verdict?: string | null, resolved: boolean, matchBlocked?: boolean | null, matchId?: string | null, tournamentId?: string | null, reporter?: { __typename?: 'User', id: string, displayName: string } | null, reported?: { __typename?: 'User', id: string, displayName: string } | null, assignee?: { __typename?: 'User', id: string, displayName: string } | null } };

export type AddLobbyCodeMutationVariables = Exact<{
  matchId: Scalars['ID'];
  lobbycode: Scalars['String'];
}>;


export type AddLobbyCodeMutation = { __typename?: 'Mutation', addLobbyCode?: { __typename?: 'Match', id: string, gameLobbyCode?: string | null, matchGames: Array<{ __typename?: 'MatchGame', id: string, number: number, status: GameStatus }> } | null };

export type AddToInGameMutationVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type AddToInGameMutation = { __typename?: 'Mutation', addToInGame?: { __typename?: 'Match', id: string, inGame: Array<string> } | null };

export type CreateSubmissionsMutationVariables = Exact<{
  data?: InputMaybe<Array<SubmissionCreateInput> | SubmissionCreateInput>;
}>;


export type CreateSubmissionsMutation = { __typename?: 'Mutation', createSubmissions?: Array<{ __typename?: 'Submission', id: string, teamId: string, resubmitted: boolean, matchGame?: { __typename?: 'MatchGame', id: string, number: number, status: GameStatus, submissionsEqual?: boolean | null, finalResults: Array<{ __typename?: 'Result', id: string, teamId: string, score: number } | null>, match: { __typename?: 'Match', id: string, inGame: Array<string> } } | null, results: Array<{ __typename?: 'Result', id: string, teamId: string, score: number }> } | null> | null };

export type SetMatchGameStatusMutationVariables = Exact<{
  matchGameId: Scalars['ID'];
}>;


export type SetMatchGameStatusMutation = { __typename?: 'Mutation', setMatchGameStatus?: { __typename?: 'MatchGame', id: string, status: GameStatus } | null };

export type GetPlayersFromTournamentQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type GetPlayersFromTournamentQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', players?: Array<{ __typename?: 'Participant', id: string, team?: { __typename?: 'Team', id: string } | null, user: { __typename?: 'User', id: string, displayName: string, gameUsers: Array<{ __typename?: 'GameUser', id: string, inGameName: string }> } } | null> | null } | null };

export type CreateTicketMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  ticketType: TicketType;
  reportedId: Scalars['ID'];
  message?: InputMaybe<Scalars['String']>;
  reporterId: Scalars['ID'];
}>;


export type CreateTicketMutation = { __typename?: 'Mutation', createTicket: { __typename?: 'Ticket', id: string, type: TicketType, message?: string | null, tournament?: { __typename?: 'Tournament', id: string } | null, reporter?: { __typename?: 'User', id: string } | null } };

export type ResetMatchMutationVariables = Exact<{
  matchId: Scalars['ID'];
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type ResetMatchMutation = { __typename?: 'Mutation', resetMatch?: { __typename?: 'Match', id: string, status: MatchStatus, gameLobbyCode?: string | null, supportLink?: string | null, inGame: Array<string>, noShowTimer?: any | null, tickets: Array<{ __typename?: 'Ticket', id: string }>, round?: { __typename?: 'Round', id: string, format: number, stage?: { __typename?: 'Stage', id: string, tournamentId: string } | null } | null, readyChecks: Array<{ __typename?: 'ReadyCheck', id: string, lobbyRole: string, participant: { __typename?: 'Participant', id: string } }>, opponents: Array<{ __typename?: 'Team', id: string, name: string, participantsReady?: number | null, allScoresSubmitted?: boolean | null, leaderId?: string | null, participants: Array<{ __typename?: 'Participant', id: string, isCreator?: boolean | null, isReady?: boolean | null, kicked: boolean, user: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null }> } }> }>, matchGames: Array<{ __typename?: 'MatchGame', id: string, status: GameStatus, number: number, submissionsEqual?: boolean | null, finalResults: Array<{ __typename?: 'Result', teamId: string, score: number } | null>, submissions: Array<{ __typename?: 'Submission', id: string, teamId: string, resubmitted: boolean, matchGame?: { __typename?: 'MatchGame', id: string, number: number } | null, results: Array<{ __typename?: 'Result', teamId: string, score: number }> }> }> } | null };

export type SetMatchWinnerMutationVariables = Exact<{
  matchId: Scalars['ID'];
  winnerId: Scalars['ID'];
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type SetMatchWinnerMutation = { __typename?: 'Mutation', setMatchWinner?: { __typename?: 'Match', id: string, status: MatchStatus, matchGames: Array<{ __typename?: 'MatchGame', id: string, number: number, status: GameStatus, result: Array<{ __typename?: 'Result', id: string, teamId: string, score: number }> }> } | null };

export type ResolvePlayerReportMutationVariables = Exact<{
  ticketId: Scalars['ID'];
  participantId: Scalars['ID'];
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type ResolvePlayerReportMutation = { __typename?: 'Mutation', resolvePlayerReport?: { __typename?: 'Ticket', id: string, resolved: boolean, verdict?: string | null, matchBlocked?: boolean | null, assignee?: { __typename?: 'User', id: string } | null } | null };

export type SetMatchResultsMutationVariables = Exact<{
  matchId: Scalars['ID'];
  matchGameResults: Array<MatchResultInput> | MatchResultInput;
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type SetMatchResultsMutation = { __typename?: 'Mutation', setMatchResults?: { __typename?: 'Match', id: string, status: MatchStatus, matchGames: Array<{ __typename?: 'MatchGame', id: string, number: number, status: GameStatus, result: Array<{ __typename?: 'Result', id: string, teamId: string, score: number }> }> } | null };

export type CloseTicketMutationVariables = Exact<{
  ticketId: Scalars['ID'];
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type CloseTicketMutation = { __typename?: 'Mutation', closeTicket?: { __typename?: 'Ticket', id: string, resolved: boolean, matchBlocked?: boolean | null, verdict?: string | null, assignee?: { __typename?: 'User', id: string } | null } | null };

export type AuthInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthInfoQuery = { __typename?: 'Query', authInfo: { __typename?: 'authInfo', authenticated: boolean, expires: any, userId: string } };

export type GetUserInfoQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, displayName: string, roles: Array<string>, permissions: Array<string>, hideAlphaDisclaimer: boolean, createdAt: any, updatedAt: any, currentMatch?: { __typename?: 'Match', id: string, status: MatchStatus, opponents: Array<{ __typename?: 'Team', id: string, name: string }> } | null, currentHost?: { __typename?: 'Participant', id: string, tournament?: { __typename?: 'Tournament', id: string, status: TournamentStatus } | null } | null, currentParticipant?: { __typename?: 'Participant', id: string, kicked: boolean, roles: Array<{ __typename?: 'ParticipantRole', id: string, type: ParticipantRoleType }>, tournament?: { __typename?: 'Tournament', id: string, title: string } | null, team?: { __typename?: 'Team', id: string } | null } | null, linkedAccounts: Array<{ __typename?: 'UserAccount', userId: string, avatar?: string | null, username: string, discriminator: string }> } | null };

export type BracketGenInfoQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type BracketGenInfoQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', id: string, checkinEnd?: any | null, participants: Array<{ __typename?: 'Participant', id: string, isPlayer?: boolean | null, isCheckedIn?: boolean | null, team?: { __typename?: 'Team', id: string, name: string, seed?: number | null, avatar?: string | null, averageElo?: number | null } | null }>, stages: Array<{ __typename?: 'Stage', id: string, type: StageType, rounds: Array<{ __typename?: 'Round', id: string, completedMatches: number, format: number, locked: boolean, number: number, status: RoundStatus, matches: Array<{ __typename?: 'Match', id: string }> }> }> } | null };

export type GenerateBracketsMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  algorithm: Scalars['String'];
}>;


export type GenerateBracketsMutation = { __typename?: 'Mutation', generateBrackets: Array<Array<Array<string | null>>> };

export type PublishBracketsMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  publishInput: Array<Array<InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>> | InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>> | Array<InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>> | InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  bestOfs: Array<InputMaybe<BestOfInput>> | InputMaybe<BestOfInput>;
}>;


export type PublishBracketsMutation = { __typename?: 'Mutation', publishBrackets?: Array<{ __typename?: 'Round', id: string, format: number, matches: Array<{ __typename?: 'Match', id: string, status: MatchStatus, number: number, opponents: Array<{ __typename?: 'Team', id: string, name: string }> }> } | null> | null };

export type RelatedChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type RelatedChatRoomsQuery = { __typename?: 'Query', relatedChatRooms: Array<{ __typename?: 'ChatRoom', id: string, name: string, tournament?: { __typename?: 'Tournament', id: string, title: string } | null, members: Array<{ __typename?: 'User', id: string, displayName: string }> }> };

export type ChatRoomMessagesQueryVariables = Exact<{
  chatRoomId: Scalars['ID'];
}>;


export type ChatRoomMessagesQuery = { __typename?: 'Query', chatRoomMessages: Array<{ __typename?: 'ChatMessage', id: string, content: string, createdAt: any, chatRoomId: string, author: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> } }> };

export type CreateMessageMutationVariables = Exact<{
  chatRoomId: Scalars['String'];
  content: Scalars['String'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createChatMessage?: { __typename?: 'ChatMessage', id: string, createdAt: any, content: string, chatRoomId: string, author: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> } } | null };

export type ChatRoomChangedSubscriptionVariables = Exact<{
  chatRoomId: Scalars['ID'];
  fetchMessages: Scalars['Boolean'];
}>;


export type ChatRoomChangedSubscription = { __typename?: 'Subscription', chatRoomChanged?: { __typename?: 'ChatRoom', id: string, name: string, tournament?: { __typename?: 'Tournament', id: string, title: string } | null, members: Array<{ __typename?: 'User', id: string, displayName: string }>, messages?: Array<{ __typename?: 'ChatMessage', id: string, createdAt: any, content: string, chatRoomId: string, author: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> } }> } | null };

export type MatchInfoQueryVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type MatchInfoQuery = { __typename?: 'Query', match?: { __typename?: 'Match', id: string, status: MatchStatus, gameLobbyCode?: string | null, supportLink?: string | null, inGame: Array<string>, noShowTimer?: any | null, round?: { __typename?: 'Round', id: string, format: number, stage?: { __typename?: 'Stage', id: string, tournament: { __typename?: 'Tournament', id: string, noShow: number } } | null } | null, readyChecks: Array<{ __typename?: 'ReadyCheck', id: string, lobbyRole: string, participant: { __typename?: 'Participant', id: string } }>, opponents: Array<{ __typename?: 'Team', id: string, name: string, participantsReady?: number | null, allScoresSubmitted?: boolean | null, leaderId?: string | null, participants: Array<{ __typename?: 'Participant', id: string, isCreator?: boolean | null, isReady?: boolean | null, kicked: boolean, user: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> } }> }>, matchGames: Array<{ __typename?: 'MatchGame', id: string, status: GameStatus, number: number, submissionsEqual?: boolean | null, finalResults: Array<{ __typename?: 'Result', id: string, teamId: string, score: number } | null>, submissions: Array<{ __typename?: 'Submission', id: string, teamId: string, resubmitted: boolean, matchGame?: { __typename?: 'MatchGame', id: string, number: number } | null, results: Array<{ __typename?: 'Result', id: string, teamId: string, score: number }> }> }> } | null };

export type MatchChangedSubscriptionVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type MatchChangedSubscription = { __typename?: 'Subscription', matchChanged?: { __typename?: 'Match', id: string, status: MatchStatus, gameLobbyCode?: string | null, supportLink?: string | null, inGame: Array<string>, noShowTimer?: any | null, round?: { __typename?: 'Round', id: string, format: number, stage?: { __typename?: 'Stage', id: string, tournament: { __typename?: 'Tournament', id: string, noShow: number } } | null } | null, readyChecks: Array<{ __typename?: 'ReadyCheck', id: string, lobbyRole: string, participant: { __typename?: 'Participant', id: string } }>, opponents: Array<{ __typename?: 'Team', id: string, name: string, participantsReady?: number | null, allScoresSubmitted?: boolean | null, leaderId?: string | null, participants: Array<{ __typename?: 'Participant', id: string, isCreator?: boolean | null, isReady?: boolean | null, kicked: boolean, user: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> } }> }>, matchGames: Array<{ __typename?: 'MatchGame', id: string, status: GameStatus, number: number, submissionsEqual?: boolean | null, finalResults: Array<{ __typename?: 'Result', id: string, teamId: string, score: number } | null>, submissions: Array<{ __typename?: 'Submission', id: string, teamId: string, resubmitted: boolean, matchGame?: { __typename?: 'MatchGame', id: string, number: number } | null, results: Array<{ __typename?: 'Result', id: string, teamId: string, score: number }> }> }> } | null };

export type RelatedTicketsQueryVariables = Exact<{ [key: string]: never; }>;


export type RelatedTicketsQuery = { __typename?: 'Query', relatedTickets?: Array<{ __typename?: 'Ticket', id: string, type: TicketType, number?: number | null, message?: string | null, verdict?: string | null, resolved: boolean, matchBlocked?: boolean | null, matchId?: string | null, assignee?: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null, username: string, discriminator: string }> } | null, reporter?: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null, username: string, discriminator: string }> } | null, reported?: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null, username: string, discriminator: string }>, participants: Array<{ __typename?: 'Participant', id: string, tournamentId?: string | null }> } | null, tournament?: { __typename?: 'Tournament', id: string, hostUser: { __typename?: 'User', id: string } } | null }> | null };

export type BracketInfoQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type BracketInfoQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', participants: Array<{ __typename?: 'Participant', teamId?: string | null, user: { __typename?: 'User', id: string } }>, stages: Array<{ __typename?: 'Stage', id: string, title?: string | null, type: StageType, rounds: Array<{ __typename?: 'Round', id: string, number: number, format: number, matches: Array<{ __typename?: 'Match', id: string, status: MatchStatus, opponents: Array<{ __typename?: 'Team', id: string, name: string, seed?: number | null, avatar?: string | null }>, matchGames: Array<{ __typename?: 'MatchGame', finalResults: Array<{ __typename?: 'Result', teamId: string, score: number } | null> }> }> }> }> } | null };

export type HubInfoQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type HubInfoQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', id: string, status: TournamentStatus, title: string, description?: string | null, rules: string, maxPlayers?: number | null, publishedAt?: any | null, date: any, checkinEnd?: any | null, checkinStart?: any | null, noShow: number, supportLink?: string | null, streamLink?: string | null, prizePool?: string | null, game: { __typename?: 'Game', id: string, title: string }, gameMode: { __typename?: 'GameMode', id: string, name: string, teamSize?: number | null }, activeRound?: { __typename?: 'Round', id: string, playersInRound?: number | null } | null, language?: { __typename?: 'Language', name: string, code: string } | null, region?: { __typename?: 'Region', code: string, name: string } | null, platforms: Array<{ __typename?: 'Platform', code: string, name: string }>, stages: Array<{ __typename?: 'Stage', type: StageType, rounds: Array<{ __typename?: 'Round', id: string, format: number, completedMatches: number, status: RoundStatus, locked: boolean, number: number, matches: Array<{ __typename?: 'Match', id: string }> }> }> } | null };

export type TournamentParticipantsQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type TournamentParticipantsQuery = { __typename?: 'Query', participantsFromTournament: Array<{ __typename?: 'Participant', id: string, requestingMod: boolean, isCurrentUser?: boolean | null, isHost?: boolean | null, isCheckedIn?: boolean | null, kicked: boolean, team?: { __typename?: 'Team', seed?: number | null, avatar?: string | null } | null, user: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }>, gameUsers: Array<{ __typename?: 'GameUser', id: string, inGameName: string, elo: number }> }, roles: Array<{ __typename?: 'ParticipantRole', type: ParticipantRoleType }> }> };

export type TournamentTicketsQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type TournamentTicketsQuery = { __typename?: 'Query', tournamentTickets: Array<{ __typename?: 'Ticket', id: string, type: TicketType, number?: number | null, message?: string | null, verdict?: string | null, resolved: boolean, matchBlocked?: boolean | null, assignee?: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }> } | null, reporter?: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }> } | null, reported?: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }>, participants: Array<{ __typename?: 'Participant', id: string, tournamentId?: string | null }> } | null, match?: { __typename?: 'Match', id: string, supportLink?: string | null, opponents: Array<{ __typename?: 'Team', id: string, name: string, participants: Array<{ __typename?: 'Participant', id: string, userId: string }> }>, matchGames: Array<{ __typename?: 'MatchGame', id: string, number: number, submissions: Array<{ __typename?: 'Submission', id: string, teamId: string, matchGame?: { __typename?: 'MatchGame', number: number } | null, results: Array<{ __typename?: 'Result', teamId: string, score: number }> }> }> } | null, tournament?: { __typename?: 'Tournament', id: string, hostUser: { __typename?: 'User', id: string } } | null }> };

export type SetRoundStatusMutationVariables = Exact<{
  roundId: Scalars['ID'];
  status?: InputMaybe<RoundStatus>;
  locked?: InputMaybe<Scalars['Boolean']>;
}>;


export type SetRoundStatusMutation = { __typename?: 'Mutation', setRoundStatus?: { __typename?: 'Round', id: string, status: RoundStatus, locked: boolean } | null };

export type SetStartTimeMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  startTime?: InputMaybe<Scalars['DateTime']>;
}>;


export type SetStartTimeMutation = { __typename?: 'Mutation', setStartTime?: { __typename?: 'Tournament', id: string, date: any } | null };

export type SetCheckInMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  startTime?: InputMaybe<Scalars['DateTime']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
}>;


export type SetCheckInMutation = { __typename?: 'Mutation', setCheckIn?: { __typename?: 'Tournament', id: string, checkinEnd?: any | null, checkinStart?: any | null } | null };

export type UpdateTournamentMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  data: TournamentCreateInput;
}>;


export type UpdateTournamentMutation = { __typename?: 'Mutation', updateTournament?: { __typename?: 'Tournament', id: string, status: TournamentStatus, title: string, description?: string | null, rules: string, maxPlayers?: number | null, publishedAt?: any | null, date: any, checkinEnd?: any | null, checkinStart?: any | null, supportLink?: string | null, streamLink?: string | null, prizePool?: string | null, game: { __typename?: 'Game', id: string, title: string }, gameMode: { __typename?: 'GameMode', id: string, name: string, teamSize?: number | null }, activeRound?: { __typename?: 'Round', id: string, playersInRound?: number | null } | null, language?: { __typename?: 'Language', name: string, code: string } | null, region?: { __typename?: 'Region', code: string, name: string } | null, platforms: Array<{ __typename?: 'Platform', code: string, name: string }>, stages: Array<{ __typename?: 'Stage', type: StageType, rounds: Array<{ __typename?: 'Round', id: string, format: number, completedMatches: number, status: RoundStatus, locked: boolean, number: number, matches: Array<{ __typename?: 'Match', id: string }> }> }> } | null };

export type DeleteTournamentMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type DeleteTournamentMutation = { __typename?: 'Mutation', deleteTournament?: { __typename?: 'Tournament', id: string, status: TournamentStatus, title: string, description?: string | null, rules: string, maxPlayers?: number | null, publishedAt?: any | null, date: any, checkinEnd?: any | null, checkinStart?: any | null, supportLink?: string | null, streamLink?: string | null, prizePool?: string | null, game: { __typename?: 'Game', id: string, title: string }, gameMode: { __typename?: 'GameMode', id: string, name: string, teamSize?: number | null }, activeRound?: { __typename?: 'Round', id: string, playersInRound?: number | null } | null, language?: { __typename?: 'Language', name: string, code: string } | null, region?: { __typename?: 'Region', code: string, name: string } | null, platforms: Array<{ __typename?: 'Platform', code: string, name: string }>, stages: Array<{ __typename?: 'Stage', type: StageType, rounds: Array<{ __typename?: 'Round', id: string, format: number, completedMatches: number, status: RoundStatus, locked: boolean, number: number, matches: Array<{ __typename?: 'Match', id: string }> }> }> } | null };

export type TournamentChangedSubscriptionVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type TournamentChangedSubscription = { __typename?: 'Subscription', tournamentChanged?: { __typename?: 'Tournament', id: string, status: TournamentStatus, description?: string | null, rules: string, maxPlayers?: number | null, publishedAt?: any | null, date: any, checkinEnd?: any | null, checkinStart?: any | null, supportLink?: string | null, streamLink?: string | null, prizePool?: string | null, game: { __typename?: 'Game', id: string, title: string }, gameMode: { __typename?: 'GameMode', id: string, name: string, teamSize?: number | null }, activeRound?: { __typename?: 'Round', id: string, playersInRound?: number | null } | null, language?: { __typename?: 'Language', name: string, code: string } | null, region?: { __typename?: 'Region', code: string, name: string } | null, platforms: Array<{ __typename?: 'Platform', code: string, name: string }>, stages: Array<{ __typename?: 'Stage', type: StageType, rounds: Array<{ __typename?: 'Round', id: string, format: number, completedMatches: number, status: RoundStatus, locked: boolean, number: number, matches: Array<{ __typename?: 'Match', id: string }> }> }> } | null };

export type SetTournamentStatusMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
  status: TournamentStatus;
  ticketId?: InputMaybe<Scalars['ID']>;
  verdict?: InputMaybe<Scalars['String']>;
}>;


export type SetTournamentStatusMutation = { __typename?: 'Mutation', setTournamentStatus?: { __typename?: 'Tournament', id: string, publishedAt?: any | null, status: TournamentStatus } | null };

export type TournamentTicketChangedSubscriptionVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type TournamentTicketChangedSubscription = { __typename?: 'Subscription', ticketChanged?: { __typename?: 'Ticket', id: string, type: TicketType, number?: number | null, message?: string | null, verdict?: string | null, resolved: boolean, matchBlocked?: boolean | null, assignee?: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }> } | null, reporter?: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }> } | null, reported?: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null, username: string, discriminator: string }>, participants: Array<{ __typename?: 'Participant', id: string, tournamentId?: string | null }> } | null, match?: { __typename?: 'Match', id: string, supportLink?: string | null, opponents: Array<{ __typename?: 'Team', id: string, name: string, participants: Array<{ __typename?: 'Participant', id: string, userId: string }> }>, matchGames: Array<{ __typename?: 'MatchGame', id: string, number: number, submissions: Array<{ __typename?: 'Submission', id: string, teamId: string, matchGame?: { __typename?: 'MatchGame', number: number } | null, results: Array<{ __typename?: 'Result', teamId: string, score: number }> }> }> } | null, tournament?: { __typename?: 'Tournament', id: string, hostUser: { __typename?: 'User', id: string } } | null } | null };

export type TournamentInfoQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type TournamentInfoQuery = { __typename?: 'Query', tournament?: { __typename?: 'Tournament', id: string, title: string, description?: string | null, status: TournamentStatus, date: any, discordLink?: string | null, streamLink?: string | null, rules: string, prizePool?: string | null, maxPlayers?: number | null, checkinStart?: any | null, checkinEnd?: any | null, publishedAt?: any | null, game: { __typename?: 'Game', id: string, title: string }, gameMode: { __typename?: 'GameMode', name: string }, hostUser: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null }> }, winnerTeam?: { __typename?: 'Team', name: string } | null, platforms: Array<{ __typename?: 'Platform', name: string }>, region?: { __typename?: 'Region', name: string } | null, language?: { __typename?: 'Language', name: string } | null, participants: Array<{ __typename?: 'Participant', id: string, isCheckedIn?: boolean | null, isRegistered?: boolean | null, isPlayer?: boolean | null, isHost?: boolean | null, isCurrentUser?: boolean | null, requestingMod: boolean, deniedMod: boolean, kicked: boolean, team?: { __typename?: 'Team', id: string, seed?: number | null } | null, roles: Array<{ __typename?: 'ParticipantRole', id: string, type: ParticipantRoleType }>, user: { __typename?: 'User', id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', avatar?: string | null }>, gameUsers: Array<{ __typename?: 'GameUser', inGameName: string, elo: number, gameId: string }> } }> } | null };

export type TournamentStagesInfoQueryVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type TournamentStagesInfoQuery = { __typename?: 'Query', tournamentStages: Array<{ __typename?: 'Stage', id: string, title?: string | null, type: StageType, rounds: Array<{ __typename?: 'Round', id: string, format: number, number: number, locked: boolean, status: RoundStatus, matches: Array<{ __typename?: 'Match', id: string, number: number, status: MatchStatus, opponents: Array<{ __typename?: 'Team', id: string, name: string, seed?: number | null, avatar?: string | null }>, matchGames: Array<{ __typename?: 'MatchGame', finalResults: Array<{ __typename?: 'Result', teamId: string, score: number } | null> }> }> }> }> };

export type UserParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserParticipantsQuery = { __typename?: 'Query', userParticipants?: Array<{ __typename?: 'Participant', id: string, checkedInAt?: any | null, isPlayer?: boolean | null, isHost?: boolean | null, tournament?: { __typename?: 'Tournament', id: string, status: TournamentStatus, checkinStart?: any | null, checkinEnd?: any | null } | null } | null> | null };

export type RemoveParticipantMutationVariables = Exact<{
  tournamentId: Scalars['ID'];
}>;


export type RemoveParticipantMutation = { __typename?: 'Mutation', removeParticipant?: { __typename?: 'Participant', id: string, checkedInAt?: any | null, registeredAt?: any | null, isPlayer?: boolean | null, isCheckedIn?: boolean | null, roles: Array<{ __typename?: 'ParticipantRole', id: string, type: ParticipantRoleType }> } | null };

export type GetGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'Game', id: string, title: string, image?: { __typename?: 'Image', url: string } | null }> };

export type CreateTournamentMutationVariables = Exact<{
  data: TournamentCreateInput;
}>;


export type CreateTournamentMutation = { __typename?: 'Mutation', createTournament?: { __typename?: 'Tournament', id: string, title: string, date: any, playersCount?: number | null, maxPlayers?: number | null, description?: string | null, status: TournamentStatus, completedRounds: number, roundsCount?: number | null, game: { __typename?: 'Game', title: string }, gameMode: { __typename?: 'GameMode', name: string }, hostUser: { __typename?: 'User', id: string, displayName: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> }, stages: Array<{ __typename?: 'Stage', type: StageType }>, platforms: Array<{ __typename?: 'Platform', name: string }>, region?: { __typename?: 'Region', name: string } | null, language?: { __typename?: 'Language', name: string } | null, activeRound?: { __typename?: 'Round', id: string } | null } | null };

export type GetTournamentsQueryVariables = Exact<{
  userHasParticipantRoles?: InputMaybe<Array<ParticipantRoleType> | ParticipantRoleType>;
}>;


export type GetTournamentsQuery = { __typename?: 'Query', tournaments?: Array<{ __typename?: 'Tournament', id: string, title: string, date: any, checkinStart?: any | null, checkinEnd?: any | null, playersCount?: number | null, maxPlayers?: number | null, description?: string | null, status: TournamentStatus, completedRounds: number, roundsCount?: number | null, userRoles?: Array<ParticipantRoleType> | null, game: { __typename?: 'Game', title: string }, gameMode: { __typename?: 'GameMode', name: string }, hostUser: { __typename?: 'User', displayName: string, id: string, linkedAccounts: Array<{ __typename?: 'UserAccount', id: string, avatar?: string | null }> }, stages: Array<{ __typename?: 'Stage', type: StageType }>, platforms: Array<{ __typename?: 'Platform', name: string }>, region?: { __typename?: 'Region', name: string } | null, language?: { __typename?: 'Language', name: string } | null, activeRound?: { __typename?: 'Round', id: string } | null } | null> | null };


export const GetUserDetailsDocument = gql`
    query getUserDetails($userId: ID!) {
  user(userId: $userId) {
    id
    linkedAccounts {
      userId
      avatar
    }
  }
}
    `;

/**
 * __useGetUserDetailsQuery__
 *
 * To run a query within a React component, call `useGetUserDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDetailsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserDetailsQuery, GetUserDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserDetailsQuery, GetUserDetailsQueryVariables>(GetUserDetailsDocument, options);
      }
export function useGetUserDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserDetailsQuery, GetUserDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserDetailsQuery, GetUserDetailsQueryVariables>(GetUserDetailsDocument, options);
        }
export type GetUserDetailsQueryHookResult = ReturnType<typeof useGetUserDetailsQuery>;
export type GetUserDetailsLazyQueryHookResult = ReturnType<typeof useGetUserDetailsLazyQuery>;
export type GetUserDetailsQueryResult = ApolloReactCommon.QueryResult<GetUserDetailsQuery, GetUserDetailsQueryVariables>;
export const CreateSavestateDocument = gql`
    mutation createSavestate($title: String) {
  createSavestate(title: $title)
}
    `;
export type CreateSavestateMutationFn = ApolloReactCommon.MutationFunction<CreateSavestateMutation, CreateSavestateMutationVariables>;

/**
 * __useCreateSavestateMutation__
 *
 * To run a mutation, you first call `useCreateSavestateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSavestateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSavestateMutation, { data, loading, error }] = useCreateSavestateMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateSavestateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSavestateMutation, CreateSavestateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSavestateMutation, CreateSavestateMutationVariables>(CreateSavestateDocument, options);
      }
export type CreateSavestateMutationHookResult = ReturnType<typeof useCreateSavestateMutation>;
export type CreateSavestateMutationResult = ApolloReactCommon.MutationResult<CreateSavestateMutation>;
export type CreateSavestateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSavestateMutation, CreateSavestateMutationVariables>;
export const RestoreSavestateDocument = gql`
    mutation restoreSavestate($title: String!) {
  restoreSavestate(title: $title)
}
    `;
export type RestoreSavestateMutationFn = ApolloReactCommon.MutationFunction<RestoreSavestateMutation, RestoreSavestateMutationVariables>;

/**
 * __useRestoreSavestateMutation__
 *
 * To run a mutation, you first call `useRestoreSavestateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestoreSavestateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restoreSavestateMutation, { data, loading, error }] = useRestoreSavestateMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useRestoreSavestateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RestoreSavestateMutation, RestoreSavestateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RestoreSavestateMutation, RestoreSavestateMutationVariables>(RestoreSavestateDocument, options);
      }
export type RestoreSavestateMutationHookResult = ReturnType<typeof useRestoreSavestateMutation>;
export type RestoreSavestateMutationResult = ApolloReactCommon.MutationResult<RestoreSavestateMutation>;
export type RestoreSavestateMutationOptions = ApolloReactCommon.BaseMutationOptions<RestoreSavestateMutation, RestoreSavestateMutationVariables>;
export const DeleteSavestateDocument = gql`
    mutation deleteSavestate($title: String!) {
  deleteSavestate(title: $title)
}
    `;
export type DeleteSavestateMutationFn = ApolloReactCommon.MutationFunction<DeleteSavestateMutation, DeleteSavestateMutationVariables>;

/**
 * __useDeleteSavestateMutation__
 *
 * To run a mutation, you first call `useDeleteSavestateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSavestateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSavestateMutation, { data, loading, error }] = useDeleteSavestateMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useDeleteSavestateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteSavestateMutation, DeleteSavestateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteSavestateMutation, DeleteSavestateMutationVariables>(DeleteSavestateDocument, options);
      }
export type DeleteSavestateMutationHookResult = ReturnType<typeof useDeleteSavestateMutation>;
export type DeleteSavestateMutationResult = ApolloReactCommon.MutationResult<DeleteSavestateMutation>;
export type DeleteSavestateMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteSavestateMutation, DeleteSavestateMutationVariables>;
export const GetSavestatesDocument = gql`
    query getSavestates {
  savestates
}
    `;

/**
 * __useGetSavestatesQuery__
 *
 * To run a query within a React component, call `useGetSavestatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSavestatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSavestatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSavestatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetSavestatesQuery, GetSavestatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSavestatesQuery, GetSavestatesQueryVariables>(GetSavestatesDocument, options);
      }
export function useGetSavestatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSavestatesQuery, GetSavestatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSavestatesQuery, GetSavestatesQueryVariables>(GetSavestatesDocument, options);
        }
export type GetSavestatesQueryHookResult = ReturnType<typeof useGetSavestatesQuery>;
export type GetSavestatesLazyQueryHookResult = ReturnType<typeof useGetSavestatesLazyQuery>;
export type GetSavestatesQueryResult = ApolloReactCommon.QueryResult<GetSavestatesQuery, GetSavestatesQueryVariables>;
export const AddParticipantDocument = gql`
    mutation addParticipant($tournamentId: ID!, $requestingMod: Boolean, $elo: Int, $name: String) {
  addParticipant(
    tournamentId: $tournamentId
    requestingMod: $requestingMod
    elo: $elo
    name: $name
  ) {
    id
    isCheckedIn
    isRegistered
    isPlayer
    isHost
    isCurrentUser
    requestingMod
    deniedMod
    kicked
    team {
      id
      seed
    }
    roles {
      type
    }
    user {
      id
      linkedAccounts {
        avatar
      }
      gameUsers {
        inGameName
        elo
        gameId
      }
    }
  }
}
    `;
export type AddParticipantMutationFn = ApolloReactCommon.MutationFunction<AddParticipantMutation, AddParticipantMutationVariables>;

/**
 * __useAddParticipantMutation__
 *
 * To run a mutation, you first call `useAddParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addParticipantMutation, { data, loading, error }] = useAddParticipantMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      requestingMod: // value for 'requestingMod'
 *      elo: // value for 'elo'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddParticipantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddParticipantMutation, AddParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddParticipantMutation, AddParticipantMutationVariables>(AddParticipantDocument, options);
      }
export type AddParticipantMutationHookResult = ReturnType<typeof useAddParticipantMutation>;
export type AddParticipantMutationResult = ApolloReactCommon.MutationResult<AddParticipantMutation>;
export type AddParticipantMutationOptions = ApolloReactCommon.BaseMutationOptions<AddParticipantMutation, AddParticipantMutationVariables>;
export const CheckinParticipantDocument = gql`
    mutation checkinParticipant($tournamentId: ID!) {
  checkinParticipant(tournamentId: $tournamentId) {
    id
    isCheckedIn
  }
}
    `;
export type CheckinParticipantMutationFn = ApolloReactCommon.MutationFunction<CheckinParticipantMutation, CheckinParticipantMutationVariables>;

/**
 * __useCheckinParticipantMutation__
 *
 * To run a mutation, you first call `useCheckinParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckinParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkinParticipantMutation, { data, loading, error }] = useCheckinParticipantMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useCheckinParticipantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CheckinParticipantMutation, CheckinParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CheckinParticipantMutation, CheckinParticipantMutationVariables>(CheckinParticipantDocument, options);
      }
export type CheckinParticipantMutationHookResult = ReturnType<typeof useCheckinParticipantMutation>;
export type CheckinParticipantMutationResult = ApolloReactCommon.MutationResult<CheckinParticipantMutation>;
export type CheckinParticipantMutationOptions = ApolloReactCommon.BaseMutationOptions<CheckinParticipantMutation, CheckinParticipantMutationVariables>;
export const GetLanguagesDocument = gql`
    query getLanguages {
  languages {
    code
    name
  }
}
    `;

/**
 * __useGetLanguagesQuery__
 *
 * To run a query within a React component, call `useGetLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLanguagesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, options);
      }
export function useGetLanguagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, options);
        }
export type GetLanguagesQueryHookResult = ReturnType<typeof useGetLanguagesQuery>;
export type GetLanguagesLazyQueryHookResult = ReturnType<typeof useGetLanguagesLazyQuery>;
export type GetLanguagesQueryResult = ApolloReactCommon.QueryResult<GetLanguagesQuery, GetLanguagesQueryVariables>;
export const GetRegionsDocument = gql`
    query getRegions {
  regions {
    code
    name
  }
}
    `;

/**
 * __useGetRegionsQuery__
 *
 * To run a query within a React component, call `useGetRegionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRegionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRegionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRegionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRegionsQuery, GetRegionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRegionsQuery, GetRegionsQueryVariables>(GetRegionsDocument, options);
      }
export function useGetRegionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRegionsQuery, GetRegionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRegionsQuery, GetRegionsQueryVariables>(GetRegionsDocument, options);
        }
export type GetRegionsQueryHookResult = ReturnType<typeof useGetRegionsQuery>;
export type GetRegionsLazyQueryHookResult = ReturnType<typeof useGetRegionsLazyQuery>;
export type GetRegionsQueryResult = ApolloReactCommon.QueryResult<GetRegionsQuery, GetRegionsQueryVariables>;
export const SetAssigneeDocument = gql`
    mutation setAssignee($ticketId: ID!, $assigneeId: ID!) {
  setTicketAssignee(ticketId: $ticketId, assigneeId: $assigneeId) {
    id
    assignee {
      id
      displayName
    }
  }
}
    `;
export type SetAssigneeMutationFn = ApolloReactCommon.MutationFunction<SetAssigneeMutation, SetAssigneeMutationVariables>;

/**
 * __useSetAssigneeMutation__
 *
 * To run a mutation, you first call `useSetAssigneeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAssigneeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAssigneeMutation, { data, loading, error }] = useSetAssigneeMutation({
 *   variables: {
 *      ticketId: // value for 'ticketId'
 *      assigneeId: // value for 'assigneeId'
 *   },
 * });
 */
export function useSetAssigneeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetAssigneeMutation, SetAssigneeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetAssigneeMutation, SetAssigneeMutationVariables>(SetAssigneeDocument, options);
      }
export type SetAssigneeMutationHookResult = ReturnType<typeof useSetAssigneeMutation>;
export type SetAssigneeMutationResult = ApolloReactCommon.MutationResult<SetAssigneeMutation>;
export type SetAssigneeMutationOptions = ApolloReactCommon.BaseMutationOptions<SetAssigneeMutation, SetAssigneeMutationVariables>;
export const UpdateGameUserEloDocument = gql`
    mutation updateGameUserElo($id: ID!, $elo: Int!, $tournamentId: ID!) {
  updateElo(id: $id, elo: $elo, tournamentId: $tournamentId) {
    id
    elo
  }
}
    `;
export type UpdateGameUserEloMutationFn = ApolloReactCommon.MutationFunction<UpdateGameUserEloMutation, UpdateGameUserEloMutationVariables>;

/**
 * __useUpdateGameUserEloMutation__
 *
 * To run a mutation, you first call `useUpdateGameUserEloMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGameUserEloMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGameUserEloMutation, { data, loading, error }] = useUpdateGameUserEloMutation({
 *   variables: {
 *      id: // value for 'id'
 *      elo: // value for 'elo'
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useUpdateGameUserEloMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateGameUserEloMutation, UpdateGameUserEloMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateGameUserEloMutation, UpdateGameUserEloMutationVariables>(UpdateGameUserEloDocument, options);
      }
export type UpdateGameUserEloMutationHookResult = ReturnType<typeof useUpdateGameUserEloMutation>;
export type UpdateGameUserEloMutationResult = ApolloReactCommon.MutationResult<UpdateGameUserEloMutation>;
export type UpdateGameUserEloMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateGameUserEloMutation, UpdateGameUserEloMutationVariables>;
export const UpdateSeedDocument = gql`
    mutation updateSeed($teamId: ID!, $seed: Int!) {
  updateSeed(teamId: $teamId, seed: $seed) {
    id
    seed
  }
}
    `;
export type UpdateSeedMutationFn = ApolloReactCommon.MutationFunction<UpdateSeedMutation, UpdateSeedMutationVariables>;

/**
 * __useUpdateSeedMutation__
 *
 * To run a mutation, you first call `useUpdateSeedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSeedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSeedMutation, { data, loading, error }] = useUpdateSeedMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      seed: // value for 'seed'
 *   },
 * });
 */
export function useUpdateSeedMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateSeedMutation, UpdateSeedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateSeedMutation, UpdateSeedMutationVariables>(UpdateSeedDocument, options);
      }
export type UpdateSeedMutationHookResult = ReturnType<typeof useUpdateSeedMutation>;
export type UpdateSeedMutationResult = ApolloReactCommon.MutationResult<UpdateSeedMutation>;
export type UpdateSeedMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateSeedMutation, UpdateSeedMutationVariables>;
export const UpdateParticipantRolesDocument = gql`
    mutation updateParticipantRoles($participantId: ID!, $addRoles: [ParticipantRoleType!], $removeRoles: [ParticipantRoleType!], $deniedMod: Boolean, $ticketId: ID, $verdict: String) {
  updateParticipantRoles(
    participantId: $participantId
    addRoles: $addRoles
    removeRoles: $removeRoles
    deniedMod: $deniedMod
    ticketId: $ticketId
    verdict: $verdict
  ) {
    id
    isCheckedIn
    isRegistered
    isPlayer
    isHost
    isCurrentUser
    requestingMod
    deniedMod
    kicked
    roles {
      type
    }
  }
}
    `;
export type UpdateParticipantRolesMutationFn = ApolloReactCommon.MutationFunction<UpdateParticipantRolesMutation, UpdateParticipantRolesMutationVariables>;

/**
 * __useUpdateParticipantRolesMutation__
 *
 * To run a mutation, you first call `useUpdateParticipantRolesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParticipantRolesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParticipantRolesMutation, { data, loading, error }] = useUpdateParticipantRolesMutation({
 *   variables: {
 *      participantId: // value for 'participantId'
 *      addRoles: // value for 'addRoles'
 *      removeRoles: // value for 'removeRoles'
 *      deniedMod: // value for 'deniedMod'
 *      ticketId: // value for 'ticketId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useUpdateParticipantRolesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateParticipantRolesMutation, UpdateParticipantRolesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateParticipantRolesMutation, UpdateParticipantRolesMutationVariables>(UpdateParticipantRolesDocument, options);
      }
export type UpdateParticipantRolesMutationHookResult = ReturnType<typeof useUpdateParticipantRolesMutation>;
export type UpdateParticipantRolesMutationResult = ApolloReactCommon.MutationResult<UpdateParticipantRolesMutation>;
export type UpdateParticipantRolesMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateParticipantRolesMutation, UpdateParticipantRolesMutationVariables>;
export const KickParticipantDocument = gql`
    mutation kickParticipant($participantId: ID!) {
  kickParticipant(participantId: $participantId) {
    id
    isCheckedIn
    isRegistered
    isPlayer
    isHost
    isCurrentUser
    requestingMod
    deniedMod
    kicked
    roles {
      type
    }
  }
}
    `;
export type KickParticipantMutationFn = ApolloReactCommon.MutationFunction<KickParticipantMutation, KickParticipantMutationVariables>;

/**
 * __useKickParticipantMutation__
 *
 * To run a mutation, you first call `useKickParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useKickParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [kickParticipantMutation, { data, loading, error }] = useKickParticipantMutation({
 *   variables: {
 *      participantId: // value for 'participantId'
 *   },
 * });
 */
export function useKickParticipantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<KickParticipantMutation, KickParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<KickParticipantMutation, KickParticipantMutationVariables>(KickParticipantDocument, options);
      }
export type KickParticipantMutationHookResult = ReturnType<typeof useKickParticipantMutation>;
export type KickParticipantMutationResult = ApolloReactCommon.MutationResult<KickParticipantMutation>;
export type KickParticipantMutationOptions = ApolloReactCommon.BaseMutationOptions<KickParticipantMutation, KickParticipantMutationVariables>;
export const CreateReadyCheckDocument = gql`
    mutation CreateReadyCheck($matchId: ID!, $participantId: ID!) {
  createReadyCheck(matchId: $matchId, participantId: $participantId) {
    id
    participant {
      id
      isCreator(matchId: $matchId)
      isReady(matchId: $matchId)
    }
    match {
      id
      readyChecks {
        id
      }
    }
  }
}
    `;
export type CreateReadyCheckMutationFn = ApolloReactCommon.MutationFunction<CreateReadyCheckMutation, CreateReadyCheckMutationVariables>;

/**
 * __useCreateReadyCheckMutation__
 *
 * To run a mutation, you first call `useCreateReadyCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReadyCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReadyCheckMutation, { data, loading, error }] = useCreateReadyCheckMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      participantId: // value for 'participantId'
 *   },
 * });
 */
export function useCreateReadyCheckMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReadyCheckMutation, CreateReadyCheckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReadyCheckMutation, CreateReadyCheckMutationVariables>(CreateReadyCheckDocument, options);
      }
export type CreateReadyCheckMutationHookResult = ReturnType<typeof useCreateReadyCheckMutation>;
export type CreateReadyCheckMutationResult = ApolloReactCommon.MutationResult<CreateReadyCheckMutation>;
export type CreateReadyCheckMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateReadyCheckMutation, CreateReadyCheckMutationVariables>;
export const ChangeStatusDocument = gql`
    mutation changeStatus($matchId: ID!, $status: MatchStatus!) {
  changeStatus(matchId: $matchId, status: $status) {
    id
    status
  }
}
    `;
export type ChangeStatusMutationFn = ApolloReactCommon.MutationFunction<ChangeStatusMutation, ChangeStatusMutationVariables>;

/**
 * __useChangeStatusMutation__
 *
 * To run a mutation, you first call `useChangeStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeStatusMutation, { data, loading, error }] = useChangeStatusMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useChangeStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangeStatusMutation, ChangeStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChangeStatusMutation, ChangeStatusMutationVariables>(ChangeStatusDocument, options);
      }
export type ChangeStatusMutationHookResult = ReturnType<typeof useChangeStatusMutation>;
export type ChangeStatusMutationResult = ApolloReactCommon.MutationResult<ChangeStatusMutation>;
export type ChangeStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangeStatusMutation, ChangeStatusMutationVariables>;
export const CreateSystemTicketDocument = gql`
    mutation createSystemTicket($matchId: ID!, $ticketType: TicketType!, $reportedId: ID, $message: String, $matchBlocked: Boolean) {
  createSystemTicket(
    matchId: $matchId
    ticketType: $ticketType
    reportedId: $reportedId
    message: $message
    matchBlocked: $matchBlocked
  ) {
    id
    type
    message
    verdict
    resolved
    matchBlocked
    matchId
    reporter {
      id
      displayName
    }
    reported {
      id
      displayName
    }
    assignee {
      id
      displayName
    }
    matchId
    tournamentId
  }
}
    `;
export type CreateSystemTicketMutationFn = ApolloReactCommon.MutationFunction<CreateSystemTicketMutation, CreateSystemTicketMutationVariables>;

/**
 * __useCreateSystemTicketMutation__
 *
 * To run a mutation, you first call `useCreateSystemTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemTicketMutation, { data, loading, error }] = useCreateSystemTicketMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      ticketType: // value for 'ticketType'
 *      reportedId: // value for 'reportedId'
 *      message: // value for 'message'
 *      matchBlocked: // value for 'matchBlocked'
 *   },
 * });
 */
export function useCreateSystemTicketMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSystemTicketMutation, CreateSystemTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSystemTicketMutation, CreateSystemTicketMutationVariables>(CreateSystemTicketDocument, options);
      }
export type CreateSystemTicketMutationHookResult = ReturnType<typeof useCreateSystemTicketMutation>;
export type CreateSystemTicketMutationResult = ApolloReactCommon.MutationResult<CreateSystemTicketMutation>;
export type CreateSystemTicketMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSystemTicketMutation, CreateSystemTicketMutationVariables>;
export const AddLobbyCodeDocument = gql`
    mutation addLobbyCode($matchId: ID!, $lobbycode: String!) {
  addLobbyCode(matchId: $matchId, lobbycode: $lobbycode) {
    id
    gameLobbyCode
    matchGames {
      id
      number
      status
    }
  }
}
    `;
export type AddLobbyCodeMutationFn = ApolloReactCommon.MutationFunction<AddLobbyCodeMutation, AddLobbyCodeMutationVariables>;

/**
 * __useAddLobbyCodeMutation__
 *
 * To run a mutation, you first call `useAddLobbyCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLobbyCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLobbyCodeMutation, { data, loading, error }] = useAddLobbyCodeMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      lobbycode: // value for 'lobbycode'
 *   },
 * });
 */
export function useAddLobbyCodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddLobbyCodeMutation, AddLobbyCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddLobbyCodeMutation, AddLobbyCodeMutationVariables>(AddLobbyCodeDocument, options);
      }
export type AddLobbyCodeMutationHookResult = ReturnType<typeof useAddLobbyCodeMutation>;
export type AddLobbyCodeMutationResult = ApolloReactCommon.MutationResult<AddLobbyCodeMutation>;
export type AddLobbyCodeMutationOptions = ApolloReactCommon.BaseMutationOptions<AddLobbyCodeMutation, AddLobbyCodeMutationVariables>;
export const AddToInGameDocument = gql`
    mutation addToInGame($matchId: ID!) {
  addToInGame(matchId: $matchId) {
    id
    inGame
  }
}
    `;
export type AddToInGameMutationFn = ApolloReactCommon.MutationFunction<AddToInGameMutation, AddToInGameMutationVariables>;

/**
 * __useAddToInGameMutation__
 *
 * To run a mutation, you first call `useAddToInGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToInGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToInGameMutation, { data, loading, error }] = useAddToInGameMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useAddToInGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddToInGameMutation, AddToInGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddToInGameMutation, AddToInGameMutationVariables>(AddToInGameDocument, options);
      }
export type AddToInGameMutationHookResult = ReturnType<typeof useAddToInGameMutation>;
export type AddToInGameMutationResult = ApolloReactCommon.MutationResult<AddToInGameMutation>;
export type AddToInGameMutationOptions = ApolloReactCommon.BaseMutationOptions<AddToInGameMutation, AddToInGameMutationVariables>;
export const CreateSubmissionsDocument = gql`
    mutation createSubmissions($data: [SubmissionCreateInput!]) {
  createSubmissions(data: $data) {
    id
    teamId
    resubmitted
    matchGame {
      id
      number
      status
      submissionsEqual
      finalResults {
        id
        teamId
        score
      }
      match {
        id
        inGame
      }
    }
    results {
      id
      teamId
      score
    }
  }
}
    `;
export type CreateSubmissionsMutationFn = ApolloReactCommon.MutationFunction<CreateSubmissionsMutation, CreateSubmissionsMutationVariables>;

/**
 * __useCreateSubmissionsMutation__
 *
 * To run a mutation, you first call `useCreateSubmissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubmissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubmissionsMutation, { data, loading, error }] = useCreateSubmissionsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSubmissionsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSubmissionsMutation, CreateSubmissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSubmissionsMutation, CreateSubmissionsMutationVariables>(CreateSubmissionsDocument, options);
      }
export type CreateSubmissionsMutationHookResult = ReturnType<typeof useCreateSubmissionsMutation>;
export type CreateSubmissionsMutationResult = ApolloReactCommon.MutationResult<CreateSubmissionsMutation>;
export type CreateSubmissionsMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSubmissionsMutation, CreateSubmissionsMutationVariables>;
export const SetMatchGameStatusDocument = gql`
    mutation setMatchGameStatus($matchGameId: ID!) {
  setMatchGameStatus(matchGameId: $matchGameId) {
    id
    status
  }
}
    `;
export type SetMatchGameStatusMutationFn = ApolloReactCommon.MutationFunction<SetMatchGameStatusMutation, SetMatchGameStatusMutationVariables>;

/**
 * __useSetMatchGameStatusMutation__
 *
 * To run a mutation, you first call `useSetMatchGameStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetMatchGameStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMatchGameStatusMutation, { data, loading, error }] = useSetMatchGameStatusMutation({
 *   variables: {
 *      matchGameId: // value for 'matchGameId'
 *   },
 * });
 */
export function useSetMatchGameStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetMatchGameStatusMutation, SetMatchGameStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetMatchGameStatusMutation, SetMatchGameStatusMutationVariables>(SetMatchGameStatusDocument, options);
      }
export type SetMatchGameStatusMutationHookResult = ReturnType<typeof useSetMatchGameStatusMutation>;
export type SetMatchGameStatusMutationResult = ApolloReactCommon.MutationResult<SetMatchGameStatusMutation>;
export type SetMatchGameStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<SetMatchGameStatusMutation, SetMatchGameStatusMutationVariables>;
export const GetPlayersFromTournamentDocument = gql`
    query getPlayersFromTournament($tournamentId: ID!) {
  tournament(tournamentId: $tournamentId) {
    players {
      id
      team {
        id
      }
      user {
        id
        displayName
        gameUsers {
          id
          inGameName
        }
      }
    }
  }
}
    `;

/**
 * __useGetPlayersFromTournamentQuery__
 *
 * To run a query within a React component, call `useGetPlayersFromTournamentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlayersFromTournamentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlayersFromTournamentQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useGetPlayersFromTournamentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPlayersFromTournamentQuery, GetPlayersFromTournamentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPlayersFromTournamentQuery, GetPlayersFromTournamentQueryVariables>(GetPlayersFromTournamentDocument, options);
      }
export function useGetPlayersFromTournamentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPlayersFromTournamentQuery, GetPlayersFromTournamentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPlayersFromTournamentQuery, GetPlayersFromTournamentQueryVariables>(GetPlayersFromTournamentDocument, options);
        }
export type GetPlayersFromTournamentQueryHookResult = ReturnType<typeof useGetPlayersFromTournamentQuery>;
export type GetPlayersFromTournamentLazyQueryHookResult = ReturnType<typeof useGetPlayersFromTournamentLazyQuery>;
export type GetPlayersFromTournamentQueryResult = ApolloReactCommon.QueryResult<GetPlayersFromTournamentQuery, GetPlayersFromTournamentQueryVariables>;
export const CreateTicketDocument = gql`
    mutation createTicket($tournamentId: ID!, $ticketType: TicketType!, $reportedId: ID!, $message: String, $reporterId: ID!) {
  createTicket(
    tournamentId: $tournamentId
    ticketType: $ticketType
    message: $message
    reporterId: $reporterId
    reportedId: $reportedId
  ) {
    id
    tournament {
      id
    }
    type
    message
    reporter {
      id
    }
    reporter {
      id
    }
  }
}
    `;
export type CreateTicketMutationFn = ApolloReactCommon.MutationFunction<CreateTicketMutation, CreateTicketMutationVariables>;

/**
 * __useCreateTicketMutation__
 *
 * To run a mutation, you first call `useCreateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTicketMutation, { data, loading, error }] = useCreateTicketMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      ticketType: // value for 'ticketType'
 *      reportedId: // value for 'reportedId'
 *      message: // value for 'message'
 *      reporterId: // value for 'reporterId'
 *   },
 * });
 */
export function useCreateTicketMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTicketMutation, CreateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateTicketMutation, CreateTicketMutationVariables>(CreateTicketDocument, options);
      }
export type CreateTicketMutationHookResult = ReturnType<typeof useCreateTicketMutation>;
export type CreateTicketMutationResult = ApolloReactCommon.MutationResult<CreateTicketMutation>;
export type CreateTicketMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTicketMutation, CreateTicketMutationVariables>;
export const ResetMatchDocument = gql`
    mutation resetMatch($matchId: ID!, $ticketId: ID, $verdict: String) {
  resetMatch(matchId: $matchId, ticketId: $ticketId, verdict: $verdict) {
    id
    status
    gameLobbyCode
    supportLink
    inGame
    noShowTimer
    tickets {
      id
    }
    round {
      id
      format
      stage {
        id
        tournamentId
      }
    }
    readyChecks {
      id
      participant {
        id
      }
      lobbyRole
    }
    opponents {
      id
      name
      participantsReady(matchId: $matchId)
      allScoresSubmitted(matchId: $matchId)
      leaderId
      participants {
        id
        isCreator(matchId: $matchId)
        isReady(matchId: $matchId)
        kicked
        user {
          id
          linkedAccounts {
            avatar
          }
        }
      }
    }
    matchGames {
      id
      status
      number
      submissionsEqual
      finalResults {
        teamId
        score
      }
      submissions {
        id
        teamId
        resubmitted
        matchGame {
          id
          number
        }
        results {
          teamId
          score
        }
      }
    }
  }
}
    `;
export type ResetMatchMutationFn = ApolloReactCommon.MutationFunction<ResetMatchMutation, ResetMatchMutationVariables>;

/**
 * __useResetMatchMutation__
 *
 * To run a mutation, you first call `useResetMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetMatchMutation, { data, loading, error }] = useResetMatchMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      ticketId: // value for 'ticketId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useResetMatchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResetMatchMutation, ResetMatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResetMatchMutation, ResetMatchMutationVariables>(ResetMatchDocument, options);
      }
export type ResetMatchMutationHookResult = ReturnType<typeof useResetMatchMutation>;
export type ResetMatchMutationResult = ApolloReactCommon.MutationResult<ResetMatchMutation>;
export type ResetMatchMutationOptions = ApolloReactCommon.BaseMutationOptions<ResetMatchMutation, ResetMatchMutationVariables>;
export const SetMatchWinnerDocument = gql`
    mutation setMatchWinner($matchId: ID!, $winnerId: ID!, $ticketId: ID, $verdict: String) {
  setMatchWinner(
    matchId: $matchId
    winnerId: $winnerId
    ticketId: $ticketId
    verdict: $verdict
  ) {
    id
    status
    matchGames {
      id
      number
      status
      result {
        id
        teamId
        score
      }
    }
  }
}
    `;
export type SetMatchWinnerMutationFn = ApolloReactCommon.MutationFunction<SetMatchWinnerMutation, SetMatchWinnerMutationVariables>;

/**
 * __useSetMatchWinnerMutation__
 *
 * To run a mutation, you first call `useSetMatchWinnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetMatchWinnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMatchWinnerMutation, { data, loading, error }] = useSetMatchWinnerMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      winnerId: // value for 'winnerId'
 *      ticketId: // value for 'ticketId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useSetMatchWinnerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetMatchWinnerMutation, SetMatchWinnerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetMatchWinnerMutation, SetMatchWinnerMutationVariables>(SetMatchWinnerDocument, options);
      }
export type SetMatchWinnerMutationHookResult = ReturnType<typeof useSetMatchWinnerMutation>;
export type SetMatchWinnerMutationResult = ApolloReactCommon.MutationResult<SetMatchWinnerMutation>;
export type SetMatchWinnerMutationOptions = ApolloReactCommon.BaseMutationOptions<SetMatchWinnerMutation, SetMatchWinnerMutationVariables>;
export const ResolvePlayerReportDocument = gql`
    mutation resolvePlayerReport($ticketId: ID!, $participantId: ID!, $verdict: String) {
  resolvePlayerReport(
    ticketId: $ticketId
    participantId: $participantId
    verdict: $verdict
  ) {
    id
    resolved
    verdict
    matchBlocked
    assignee {
      id
    }
  }
}
    `;
export type ResolvePlayerReportMutationFn = ApolloReactCommon.MutationFunction<ResolvePlayerReportMutation, ResolvePlayerReportMutationVariables>;

/**
 * __useResolvePlayerReportMutation__
 *
 * To run a mutation, you first call `useResolvePlayerReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResolvePlayerReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resolvePlayerReportMutation, { data, loading, error }] = useResolvePlayerReportMutation({
 *   variables: {
 *      ticketId: // value for 'ticketId'
 *      participantId: // value for 'participantId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useResolvePlayerReportMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResolvePlayerReportMutation, ResolvePlayerReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResolvePlayerReportMutation, ResolvePlayerReportMutationVariables>(ResolvePlayerReportDocument, options);
      }
export type ResolvePlayerReportMutationHookResult = ReturnType<typeof useResolvePlayerReportMutation>;
export type ResolvePlayerReportMutationResult = ApolloReactCommon.MutationResult<ResolvePlayerReportMutation>;
export type ResolvePlayerReportMutationOptions = ApolloReactCommon.BaseMutationOptions<ResolvePlayerReportMutation, ResolvePlayerReportMutationVariables>;
export const SetMatchResultsDocument = gql`
    mutation setMatchResults($matchId: ID!, $matchGameResults: [MatchResultInput!]!, $ticketId: ID, $verdict: String) {
  setMatchResults(
    matchId: $matchId
    matchGameResults: $matchGameResults
    ticketId: $ticketId
    verdict: $verdict
  ) {
    id
    status
    matchGames {
      id
      number
      status
      result {
        id
        teamId
        score
      }
    }
  }
}
    `;
export type SetMatchResultsMutationFn = ApolloReactCommon.MutationFunction<SetMatchResultsMutation, SetMatchResultsMutationVariables>;

/**
 * __useSetMatchResultsMutation__
 *
 * To run a mutation, you first call `useSetMatchResultsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetMatchResultsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMatchResultsMutation, { data, loading, error }] = useSetMatchResultsMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      matchGameResults: // value for 'matchGameResults'
 *      ticketId: // value for 'ticketId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useSetMatchResultsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetMatchResultsMutation, SetMatchResultsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetMatchResultsMutation, SetMatchResultsMutationVariables>(SetMatchResultsDocument, options);
      }
export type SetMatchResultsMutationHookResult = ReturnType<typeof useSetMatchResultsMutation>;
export type SetMatchResultsMutationResult = ApolloReactCommon.MutationResult<SetMatchResultsMutation>;
export type SetMatchResultsMutationOptions = ApolloReactCommon.BaseMutationOptions<SetMatchResultsMutation, SetMatchResultsMutationVariables>;
export const CloseTicketDocument = gql`
    mutation closeTicket($ticketId: ID!, $verdict: String) {
  closeTicket(ticketId: $ticketId, verdict: $verdict) {
    id
    resolved
    matchBlocked
    verdict
    assignee {
      id
    }
  }
}
    `;
export type CloseTicketMutationFn = ApolloReactCommon.MutationFunction<CloseTicketMutation, CloseTicketMutationVariables>;

/**
 * __useCloseTicketMutation__
 *
 * To run a mutation, you first call `useCloseTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeTicketMutation, { data, loading, error }] = useCloseTicketMutation({
 *   variables: {
 *      ticketId: // value for 'ticketId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useCloseTicketMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CloseTicketMutation, CloseTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CloseTicketMutation, CloseTicketMutationVariables>(CloseTicketDocument, options);
      }
export type CloseTicketMutationHookResult = ReturnType<typeof useCloseTicketMutation>;
export type CloseTicketMutationResult = ApolloReactCommon.MutationResult<CloseTicketMutation>;
export type CloseTicketMutationOptions = ApolloReactCommon.BaseMutationOptions<CloseTicketMutation, CloseTicketMutationVariables>;
export const AuthInfoDocument = gql`
    query AuthInfo {
  authInfo @client {
    authenticated
    expires
    userId
  }
}
    `;

/**
 * __useAuthInfoQuery__
 *
 * To run a query within a React component, call `useAuthInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuthInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AuthInfoQuery, AuthInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<AuthInfoQuery, AuthInfoQueryVariables>(AuthInfoDocument, options);
      }
export function useAuthInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AuthInfoQuery, AuthInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<AuthInfoQuery, AuthInfoQueryVariables>(AuthInfoDocument, options);
        }
export type AuthInfoQueryHookResult = ReturnType<typeof useAuthInfoQuery>;
export type AuthInfoLazyQueryHookResult = ReturnType<typeof useAuthInfoLazyQuery>;
export type AuthInfoQueryResult = ApolloReactCommon.QueryResult<AuthInfoQuery, AuthInfoQueryVariables>;
export const GetUserInfoDocument = gql`
    query getUserInfo($userId: ID!) {
  user(userId: $userId) {
    id
    displayName
    roles
    permissions
    hideAlphaDisclaimer
    createdAt
    updatedAt
    currentMatch {
      id
      status
      opponents {
        id
        name
      }
    }
    currentHost {
      id
      tournament {
        id
        status
      }
    }
    currentParticipant {
      id
      kicked
      roles {
        id
        type
      }
      tournament {
        id
        title
      }
      team {
        id
      }
    }
    linkedAccounts {
      userId
      avatar
      username
      discriminator
    }
  }
}
    `;

/**
 * __useGetUserInfoQuery__
 *
 * To run a query within a React component, call `useGetUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInfoQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
      }
export function useGetUserInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
        }
export type GetUserInfoQueryHookResult = ReturnType<typeof useGetUserInfoQuery>;
export type GetUserInfoLazyQueryHookResult = ReturnType<typeof useGetUserInfoLazyQuery>;
export type GetUserInfoQueryResult = ApolloReactCommon.QueryResult<GetUserInfoQuery, GetUserInfoQueryVariables>;
export const BracketGenInfoDocument = gql`
    query BracketGenInfo($tournamentId: ID!) {
  tournament(tournamentId: $tournamentId) {
    id
    checkinEnd
    participants {
      id
      isPlayer
      isCheckedIn
      team {
        id
        name
        seed
        avatar
        averageElo
      }
    }
    stages {
      id
      type
      rounds {
        id
        completedMatches
        format
        locked
        number
        status
        matches {
          id
        }
      }
    }
  }
}
    `;

/**
 * __useBracketGenInfoQuery__
 *
 * To run a query within a React component, call `useBracketGenInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useBracketGenInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBracketGenInfoQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useBracketGenInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<BracketGenInfoQuery, BracketGenInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<BracketGenInfoQuery, BracketGenInfoQueryVariables>(BracketGenInfoDocument, options);
      }
export function useBracketGenInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<BracketGenInfoQuery, BracketGenInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<BracketGenInfoQuery, BracketGenInfoQueryVariables>(BracketGenInfoDocument, options);
        }
export type BracketGenInfoQueryHookResult = ReturnType<typeof useBracketGenInfoQuery>;
export type BracketGenInfoLazyQueryHookResult = ReturnType<typeof useBracketGenInfoLazyQuery>;
export type BracketGenInfoQueryResult = ApolloReactCommon.QueryResult<BracketGenInfoQuery, BracketGenInfoQueryVariables>;
export const GenerateBracketsDocument = gql`
    mutation generateBrackets($tournamentId: ID!, $algorithm: String!) {
  generateBrackets(tournamentId: $tournamentId, algorithm: $algorithm)
}
    `;
export type GenerateBracketsMutationFn = ApolloReactCommon.MutationFunction<GenerateBracketsMutation, GenerateBracketsMutationVariables>;

/**
 * __useGenerateBracketsMutation__
 *
 * To run a mutation, you first call `useGenerateBracketsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateBracketsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateBracketsMutation, { data, loading, error }] = useGenerateBracketsMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      algorithm: // value for 'algorithm'
 *   },
 * });
 */
export function useGenerateBracketsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GenerateBracketsMutation, GenerateBracketsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<GenerateBracketsMutation, GenerateBracketsMutationVariables>(GenerateBracketsDocument, options);
      }
export type GenerateBracketsMutationHookResult = ReturnType<typeof useGenerateBracketsMutation>;
export type GenerateBracketsMutationResult = ApolloReactCommon.MutationResult<GenerateBracketsMutation>;
export type GenerateBracketsMutationOptions = ApolloReactCommon.BaseMutationOptions<GenerateBracketsMutation, GenerateBracketsMutationVariables>;
export const PublishBracketsDocument = gql`
    mutation publishBrackets($tournamentId: ID!, $publishInput: [[[String]]!]!, $bestOfs: [BestOfInput]!) {
  publishBrackets(
    tournamentId: $tournamentId
    publishInput: $publishInput
    bestOfs: $bestOfs
  ) {
    id
    format
    matches {
      id
      status
      number
      opponents {
        id
        name
      }
    }
  }
}
    `;
export type PublishBracketsMutationFn = ApolloReactCommon.MutationFunction<PublishBracketsMutation, PublishBracketsMutationVariables>;

/**
 * __usePublishBracketsMutation__
 *
 * To run a mutation, you first call `usePublishBracketsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishBracketsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishBracketsMutation, { data, loading, error }] = usePublishBracketsMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      publishInput: // value for 'publishInput'
 *      bestOfs: // value for 'bestOfs'
 *   },
 * });
 */
export function usePublishBracketsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PublishBracketsMutation, PublishBracketsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PublishBracketsMutation, PublishBracketsMutationVariables>(PublishBracketsDocument, options);
      }
export type PublishBracketsMutationHookResult = ReturnType<typeof usePublishBracketsMutation>;
export type PublishBracketsMutationResult = ApolloReactCommon.MutationResult<PublishBracketsMutation>;
export type PublishBracketsMutationOptions = ApolloReactCommon.BaseMutationOptions<PublishBracketsMutation, PublishBracketsMutationVariables>;
export const RelatedChatRoomsDocument = gql`
    query relatedChatRooms {
  relatedChatRooms {
    id
    name
    tournament {
      id
      title
    }
    members {
      id
      displayName
    }
  }
}
    `;

/**
 * __useRelatedChatRoomsQuery__
 *
 * To run a query within a React component, call `useRelatedChatRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRelatedChatRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRelatedChatRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRelatedChatRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RelatedChatRoomsQuery, RelatedChatRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RelatedChatRoomsQuery, RelatedChatRoomsQueryVariables>(RelatedChatRoomsDocument, options);
      }
export function useRelatedChatRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RelatedChatRoomsQuery, RelatedChatRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RelatedChatRoomsQuery, RelatedChatRoomsQueryVariables>(RelatedChatRoomsDocument, options);
        }
export type RelatedChatRoomsQueryHookResult = ReturnType<typeof useRelatedChatRoomsQuery>;
export type RelatedChatRoomsLazyQueryHookResult = ReturnType<typeof useRelatedChatRoomsLazyQuery>;
export type RelatedChatRoomsQueryResult = ApolloReactCommon.QueryResult<RelatedChatRoomsQuery, RelatedChatRoomsQueryVariables>;
export const ChatRoomMessagesDocument = gql`
    query chatRoomMessages($chatRoomId: ID!) {
  chatRoomMessages(chatRoomId: $chatRoomId) {
    id
    content
    createdAt
    author {
      id
      displayName
      linkedAccounts {
        id
        avatar
      }
    }
    chatRoomId
  }
}
    `;

/**
 * __useChatRoomMessagesQuery__
 *
 * To run a query within a React component, call `useChatRoomMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatRoomMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatRoomMessagesQuery({
 *   variables: {
 *      chatRoomId: // value for 'chatRoomId'
 *   },
 * });
 */
export function useChatRoomMessagesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ChatRoomMessagesQuery, ChatRoomMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ChatRoomMessagesQuery, ChatRoomMessagesQueryVariables>(ChatRoomMessagesDocument, options);
      }
export function useChatRoomMessagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ChatRoomMessagesQuery, ChatRoomMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ChatRoomMessagesQuery, ChatRoomMessagesQueryVariables>(ChatRoomMessagesDocument, options);
        }
export type ChatRoomMessagesQueryHookResult = ReturnType<typeof useChatRoomMessagesQuery>;
export type ChatRoomMessagesLazyQueryHookResult = ReturnType<typeof useChatRoomMessagesLazyQuery>;
export type ChatRoomMessagesQueryResult = ApolloReactCommon.QueryResult<ChatRoomMessagesQuery, ChatRoomMessagesQueryVariables>;
export const CreateMessageDocument = gql`
    mutation createMessage($chatRoomId: String!, $content: String!) {
  createChatMessage(chatRoomId: $chatRoomId, content: $content) {
    id
    createdAt
    content
    chatRoomId
    author {
      id
      displayName
      linkedAccounts {
        id
        avatar
      }
    }
  }
}
    `;
export type CreateMessageMutationFn = ApolloReactCommon.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      chatRoomId: // value for 'chatRoomId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = ApolloReactCommon.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const ChatRoomChangedDocument = gql`
    subscription chatRoomChanged($chatRoomId: ID!, $fetchMessages: Boolean!) {
  chatRoomChanged(chatRoomId: $chatRoomId) {
    id
    name
    tournament {
      id
      title
    }
    members {
      id
      displayName
    }
    messages @include(if: $fetchMessages) {
      id
      createdAt
      content
      chatRoomId
      author {
        id
        displayName
        linkedAccounts {
          id
          avatar
        }
      }
    }
  }
}
    `;

/**
 * __useChatRoomChangedSubscription__
 *
 * To run a query within a React component, call `useChatRoomChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatRoomChangedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatRoomChangedSubscription({
 *   variables: {
 *      chatRoomId: // value for 'chatRoomId'
 *      fetchMessages: // value for 'fetchMessages'
 *   },
 * });
 */
export function useChatRoomChangedSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<ChatRoomChangedSubscription, ChatRoomChangedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<ChatRoomChangedSubscription, ChatRoomChangedSubscriptionVariables>(ChatRoomChangedDocument, options);
      }
export type ChatRoomChangedSubscriptionHookResult = ReturnType<typeof useChatRoomChangedSubscription>;
export type ChatRoomChangedSubscriptionResult = ApolloReactCommon.SubscriptionResult<ChatRoomChangedSubscription>;
export const MatchInfoDocument = gql`
    query matchInfo($matchId: ID!) {
  match(matchId: $matchId) {
    id
    status
    gameLobbyCode
    supportLink
    inGame
    noShowTimer
    round {
      id
      format
      stage {
        id
        tournament {
          id
          noShow
        }
      }
    }
    readyChecks {
      id
      participant {
        id
      }
      lobbyRole
    }
    opponents {
      id
      name
      participantsReady(matchId: $matchId)
      allScoresSubmitted(matchId: $matchId)
      leaderId
      participants {
        id
        isCreator(matchId: $matchId)
        isReady(matchId: $matchId)
        kicked
        user {
          id
          linkedAccounts {
            id
            avatar
          }
        }
      }
    }
    matchGames {
      id
      status
      number
      submissionsEqual
      finalResults {
        id
        teamId
        score
      }
      submissions {
        id
        teamId
        resubmitted
        matchGame {
          id
          number
        }
        results {
          id
          teamId
          score
        }
      }
    }
  }
}
    `;

/**
 * __useMatchInfoQuery__
 *
 * To run a query within a React component, call `useMatchInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useMatchInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchInfoQuery({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useMatchInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MatchInfoQuery, MatchInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MatchInfoQuery, MatchInfoQueryVariables>(MatchInfoDocument, options);
      }
export function useMatchInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MatchInfoQuery, MatchInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MatchInfoQuery, MatchInfoQueryVariables>(MatchInfoDocument, options);
        }
export type MatchInfoQueryHookResult = ReturnType<typeof useMatchInfoQuery>;
export type MatchInfoLazyQueryHookResult = ReturnType<typeof useMatchInfoLazyQuery>;
export type MatchInfoQueryResult = ApolloReactCommon.QueryResult<MatchInfoQuery, MatchInfoQueryVariables>;
export const MatchChangedDocument = gql`
    subscription matchChanged($matchId: ID!) {
  matchChanged(matchId: $matchId) {
    id
    status
    gameLobbyCode
    supportLink
    inGame
    noShowTimer
    round {
      id
      format
      stage {
        id
        tournament {
          id
          noShow
        }
      }
    }
    readyChecks {
      id
      participant {
        id
      }
      lobbyRole
    }
    opponents {
      id
      name
      participantsReady(matchId: $matchId)
      allScoresSubmitted(matchId: $matchId)
      leaderId
      participants {
        id
        isCreator(matchId: $matchId)
        isReady(matchId: $matchId)
        kicked
        user {
          id
          linkedAccounts {
            id
            avatar
          }
        }
      }
    }
    matchGames {
      id
      status
      number
      submissionsEqual
      finalResults {
        id
        teamId
        score
      }
      submissions {
        id
        teamId
        resubmitted
        matchGame {
          id
          number
        }
        results {
          id
          teamId
          score
        }
      }
    }
  }
}
    `;

/**
 * __useMatchChangedSubscription__
 *
 * To run a query within a React component, call `useMatchChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMatchChangedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchChangedSubscription({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useMatchChangedSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<MatchChangedSubscription, MatchChangedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<MatchChangedSubscription, MatchChangedSubscriptionVariables>(MatchChangedDocument, options);
      }
export type MatchChangedSubscriptionHookResult = ReturnType<typeof useMatchChangedSubscription>;
export type MatchChangedSubscriptionResult = ApolloReactCommon.SubscriptionResult<MatchChangedSubscription>;
export const RelatedTicketsDocument = gql`
    query RelatedTickets {
  relatedTickets {
    id
    type
    number
    message
    verdict
    resolved
    matchBlocked
    matchId
    assignee {
      id
      displayName
      linkedAccounts {
        id
        avatar
        username
        discriminator
      }
    }
    reporter {
      id
      linkedAccounts {
        id
        avatar
        username
        discriminator
      }
    }
    reported {
      id
      displayName
      linkedAccounts {
        id
        avatar
        username
        discriminator
      }
      participants {
        id
        tournamentId
      }
    }
    tournament {
      id
      hostUser {
        id
      }
    }
  }
}
    `;

/**
 * __useRelatedTicketsQuery__
 *
 * To run a query within a React component, call `useRelatedTicketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRelatedTicketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRelatedTicketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRelatedTicketsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RelatedTicketsQuery, RelatedTicketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<RelatedTicketsQuery, RelatedTicketsQueryVariables>(RelatedTicketsDocument, options);
      }
export function useRelatedTicketsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RelatedTicketsQuery, RelatedTicketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<RelatedTicketsQuery, RelatedTicketsQueryVariables>(RelatedTicketsDocument, options);
        }
export type RelatedTicketsQueryHookResult = ReturnType<typeof useRelatedTicketsQuery>;
export type RelatedTicketsLazyQueryHookResult = ReturnType<typeof useRelatedTicketsLazyQuery>;
export type RelatedTicketsQueryResult = ApolloReactCommon.QueryResult<RelatedTicketsQuery, RelatedTicketsQueryVariables>;
export const BracketInfoDocument = gql`
    query BracketInfo($tournamentId: ID!) {
  tournament(tournamentId: $tournamentId) {
    participants {
      teamId
      user {
        id
      }
    }
    stages {
      id
      title
      type
      rounds {
        id
        number
        format
        matches {
          id
          status
          opponents {
            id
            name
            seed
            avatar
          }
          matchGames {
            finalResults {
              teamId
              score
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useBracketInfoQuery__
 *
 * To run a query within a React component, call `useBracketInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useBracketInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBracketInfoQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useBracketInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<BracketInfoQuery, BracketInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<BracketInfoQuery, BracketInfoQueryVariables>(BracketInfoDocument, options);
      }
export function useBracketInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<BracketInfoQuery, BracketInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<BracketInfoQuery, BracketInfoQueryVariables>(BracketInfoDocument, options);
        }
export type BracketInfoQueryHookResult = ReturnType<typeof useBracketInfoQuery>;
export type BracketInfoLazyQueryHookResult = ReturnType<typeof useBracketInfoLazyQuery>;
export type BracketInfoQueryResult = ApolloReactCommon.QueryResult<BracketInfoQuery, BracketInfoQueryVariables>;
export const HubInfoDocument = gql`
    query HubInfo($tournamentId: ID!) {
  tournament(tournamentId: $tournamentId) {
    id
    status
    title
    description
    rules
    maxPlayers
    game {
      id
      title
    }
    gameMode {
      id
      name
      teamSize
    }
    publishedAt
    date
    checkinEnd
    checkinStart
    noShow
    supportLink
    streamLink
    prizePool
    activeRound {
      id
      playersInRound
    }
    language {
      name
      code
    }
    region {
      code
      name
    }
    platforms {
      code
      name
    }
    stages {
      type
      rounds {
        id
        format
        completedMatches
        status
        locked
        number
        matches {
          id
        }
      }
    }
  }
}
    `;

/**
 * __useHubInfoQuery__
 *
 * To run a query within a React component, call `useHubInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useHubInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHubInfoQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useHubInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<HubInfoQuery, HubInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<HubInfoQuery, HubInfoQueryVariables>(HubInfoDocument, options);
      }
export function useHubInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HubInfoQuery, HubInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<HubInfoQuery, HubInfoQueryVariables>(HubInfoDocument, options);
        }
export type HubInfoQueryHookResult = ReturnType<typeof useHubInfoQuery>;
export type HubInfoLazyQueryHookResult = ReturnType<typeof useHubInfoLazyQuery>;
export type HubInfoQueryResult = ApolloReactCommon.QueryResult<HubInfoQuery, HubInfoQueryVariables>;
export const TournamentParticipantsDocument = gql`
    query TournamentParticipants($tournamentId: ID!) {
  participantsFromTournament(tournamentId: $tournamentId) {
    id
    requestingMod
    isCurrentUser
    isHost
    isCheckedIn
    kicked
    team {
      seed
      avatar
    }
    user {
      id
      displayName
      linkedAccounts {
        avatar
        username
        discriminator
      }
      gameUsers {
        id
        inGameName
        elo
      }
    }
    roles {
      type
    }
  }
}
    `;

/**
 * __useTournamentParticipantsQuery__
 *
 * To run a query within a React component, call `useTournamentParticipantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentParticipantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentParticipantsQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useTournamentParticipantsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TournamentParticipantsQuery, TournamentParticipantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TournamentParticipantsQuery, TournamentParticipantsQueryVariables>(TournamentParticipantsDocument, options);
      }
export function useTournamentParticipantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TournamentParticipantsQuery, TournamentParticipantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TournamentParticipantsQuery, TournamentParticipantsQueryVariables>(TournamentParticipantsDocument, options);
        }
export type TournamentParticipantsQueryHookResult = ReturnType<typeof useTournamentParticipantsQuery>;
export type TournamentParticipantsLazyQueryHookResult = ReturnType<typeof useTournamentParticipantsLazyQuery>;
export type TournamentParticipantsQueryResult = ApolloReactCommon.QueryResult<TournamentParticipantsQuery, TournamentParticipantsQueryVariables>;
export const TournamentTicketsDocument = gql`
    query TournamentTickets($tournamentId: ID!) {
  tournamentTickets(tournamentId: $tournamentId) {
    id
    type
    number
    assignee {
      id
      displayName
      linkedAccounts {
        avatar
        username
        discriminator
      }
    }
    reporter {
      id
      linkedAccounts {
        avatar
        username
        discriminator
      }
    }
    reported {
      id
      displayName
      linkedAccounts {
        avatar
        username
        discriminator
      }
      participants {
        id
        tournamentId
      }
    }
    message
    verdict
    resolved
    matchBlocked
    match {
      id
      supportLink
      opponents {
        id
        name
        participants {
          id
          userId
        }
      }
      matchGames {
        id
        number
        submissions {
          id
          teamId
          matchGame {
            number
          }
          results {
            teamId
            score
          }
        }
      }
    }
    tournament {
      id
      hostUser {
        id
      }
    }
  }
}
    `;

/**
 * __useTournamentTicketsQuery__
 *
 * To run a query within a React component, call `useTournamentTicketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentTicketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentTicketsQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useTournamentTicketsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TournamentTicketsQuery, TournamentTicketsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TournamentTicketsQuery, TournamentTicketsQueryVariables>(TournamentTicketsDocument, options);
      }
export function useTournamentTicketsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TournamentTicketsQuery, TournamentTicketsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TournamentTicketsQuery, TournamentTicketsQueryVariables>(TournamentTicketsDocument, options);
        }
export type TournamentTicketsQueryHookResult = ReturnType<typeof useTournamentTicketsQuery>;
export type TournamentTicketsLazyQueryHookResult = ReturnType<typeof useTournamentTicketsLazyQuery>;
export type TournamentTicketsQueryResult = ApolloReactCommon.QueryResult<TournamentTicketsQuery, TournamentTicketsQueryVariables>;
export const SetRoundStatusDocument = gql`
    mutation setRoundStatus($roundId: ID!, $status: RoundStatus, $locked: Boolean) {
  setRoundStatus(roundId: $roundId, status: $status, locked: $locked) {
    id
    status
    locked
  }
}
    `;
export type SetRoundStatusMutationFn = ApolloReactCommon.MutationFunction<SetRoundStatusMutation, SetRoundStatusMutationVariables>;

/**
 * __useSetRoundStatusMutation__
 *
 * To run a mutation, you first call `useSetRoundStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRoundStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRoundStatusMutation, { data, loading, error }] = useSetRoundStatusMutation({
 *   variables: {
 *      roundId: // value for 'roundId'
 *      status: // value for 'status'
 *      locked: // value for 'locked'
 *   },
 * });
 */
export function useSetRoundStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetRoundStatusMutation, SetRoundStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetRoundStatusMutation, SetRoundStatusMutationVariables>(SetRoundStatusDocument, options);
      }
export type SetRoundStatusMutationHookResult = ReturnType<typeof useSetRoundStatusMutation>;
export type SetRoundStatusMutationResult = ApolloReactCommon.MutationResult<SetRoundStatusMutation>;
export type SetRoundStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<SetRoundStatusMutation, SetRoundStatusMutationVariables>;
export const SetStartTimeDocument = gql`
    mutation setStartTime($tournamentId: ID!, $startTime: DateTime) {
  setStartTime(tournamentId: $tournamentId, startTime: $startTime) {
    id
    date
  }
}
    `;
export type SetStartTimeMutationFn = ApolloReactCommon.MutationFunction<SetStartTimeMutation, SetStartTimeMutationVariables>;

/**
 * __useSetStartTimeMutation__
 *
 * To run a mutation, you first call `useSetStartTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetStartTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setStartTimeMutation, { data, loading, error }] = useSetStartTimeMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      startTime: // value for 'startTime'
 *   },
 * });
 */
export function useSetStartTimeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetStartTimeMutation, SetStartTimeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetStartTimeMutation, SetStartTimeMutationVariables>(SetStartTimeDocument, options);
      }
export type SetStartTimeMutationHookResult = ReturnType<typeof useSetStartTimeMutation>;
export type SetStartTimeMutationResult = ApolloReactCommon.MutationResult<SetStartTimeMutation>;
export type SetStartTimeMutationOptions = ApolloReactCommon.BaseMutationOptions<SetStartTimeMutation, SetStartTimeMutationVariables>;
export const SetCheckInDocument = gql`
    mutation setCheckIn($tournamentId: ID!, $startTime: DateTime, $endTime: DateTime) {
  setCheckIn(
    tournamentId: $tournamentId
    startTime: $startTime
    endTime: $endTime
  ) {
    id
    checkinEnd
    checkinStart
  }
}
    `;
export type SetCheckInMutationFn = ApolloReactCommon.MutationFunction<SetCheckInMutation, SetCheckInMutationVariables>;

/**
 * __useSetCheckInMutation__
 *
 * To run a mutation, you first call `useSetCheckInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCheckInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCheckInMutation, { data, loading, error }] = useSetCheckInMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *   },
 * });
 */
export function useSetCheckInMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetCheckInMutation, SetCheckInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetCheckInMutation, SetCheckInMutationVariables>(SetCheckInDocument, options);
      }
export type SetCheckInMutationHookResult = ReturnType<typeof useSetCheckInMutation>;
export type SetCheckInMutationResult = ApolloReactCommon.MutationResult<SetCheckInMutation>;
export type SetCheckInMutationOptions = ApolloReactCommon.BaseMutationOptions<SetCheckInMutation, SetCheckInMutationVariables>;
export const UpdateTournamentDocument = gql`
    mutation updateTournament($tournamentId: ID!, $data: TournamentCreateInput!) {
  updateTournament(tournamentId: $tournamentId, data: $data) {
    id
    status
    title
    description
    rules
    maxPlayers
    game {
      id
      title
    }
    gameMode {
      id
      name
      teamSize
    }
    publishedAt
    date
    checkinEnd
    checkinStart
    supportLink
    streamLink
    prizePool
    activeRound {
      id
      playersInRound
    }
    language {
      name
      code
    }
    region {
      code
      name
    }
    platforms {
      code
      name
    }
    stages {
      type
      rounds {
        id
        format
        completedMatches
        status
        locked
        number
        matches {
          id
        }
      }
    }
  }
}
    `;
export type UpdateTournamentMutationFn = ApolloReactCommon.MutationFunction<UpdateTournamentMutation, UpdateTournamentMutationVariables>;

/**
 * __useUpdateTournamentMutation__
 *
 * To run a mutation, you first call `useUpdateTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTournamentMutation, { data, loading, error }] = useUpdateTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTournamentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateTournamentMutation, UpdateTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateTournamentMutation, UpdateTournamentMutationVariables>(UpdateTournamentDocument, options);
      }
export type UpdateTournamentMutationHookResult = ReturnType<typeof useUpdateTournamentMutation>;
export type UpdateTournamentMutationResult = ApolloReactCommon.MutationResult<UpdateTournamentMutation>;
export type UpdateTournamentMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTournamentMutation, UpdateTournamentMutationVariables>;
export const DeleteTournamentDocument = gql`
    mutation deleteTournament($tournamentId: ID!) {
  deleteTournament(tournamentId: $tournamentId) {
    id
    status
    title
    description
    rules
    maxPlayers
    game {
      id
      title
    }
    gameMode {
      id
      name
      teamSize
    }
    publishedAt
    date
    checkinEnd
    checkinStart
    supportLink
    streamLink
    prizePool
    activeRound {
      id
      playersInRound
    }
    language {
      name
      code
    }
    region {
      code
      name
    }
    platforms {
      code
      name
    }
    stages {
      type
      rounds {
        id
        format
        completedMatches
        status
        locked
        number
        matches {
          id
        }
      }
    }
  }
}
    `;
export type DeleteTournamentMutationFn = ApolloReactCommon.MutationFunction<DeleteTournamentMutation, DeleteTournamentMutationVariables>;

/**
 * __useDeleteTournamentMutation__
 *
 * To run a mutation, you first call `useDeleteTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTournamentMutation, { data, loading, error }] = useDeleteTournamentMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useDeleteTournamentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTournamentMutation, DeleteTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteTournamentMutation, DeleteTournamentMutationVariables>(DeleteTournamentDocument, options);
      }
export type DeleteTournamentMutationHookResult = ReturnType<typeof useDeleteTournamentMutation>;
export type DeleteTournamentMutationResult = ApolloReactCommon.MutationResult<DeleteTournamentMutation>;
export type DeleteTournamentMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTournamentMutation, DeleteTournamentMutationVariables>;
export const TournamentChangedDocument = gql`
    subscription TournamentChanged($tournamentId: ID!) {
  tournamentChanged(tournamentId: $tournamentId) {
    id
    status
    description
    rules
    maxPlayers
    game {
      id
      title
    }
    gameMode {
      id
      name
      teamSize
    }
    publishedAt
    date
    checkinEnd
    checkinStart
    supportLink
    streamLink
    prizePool
    activeRound {
      id
      playersInRound
    }
    language {
      name
      code
    }
    region {
      code
      name
    }
    platforms {
      code
      name
    }
    stages {
      type
      rounds {
        id
        format
        completedMatches
        status
        locked
        number
        matches {
          id
        }
      }
    }
  }
}
    `;

/**
 * __useTournamentChangedSubscription__
 *
 * To run a query within a React component, call `useTournamentChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTournamentChangedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentChangedSubscription({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useTournamentChangedSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<TournamentChangedSubscription, TournamentChangedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<TournamentChangedSubscription, TournamentChangedSubscriptionVariables>(TournamentChangedDocument, options);
      }
export type TournamentChangedSubscriptionHookResult = ReturnType<typeof useTournamentChangedSubscription>;
export type TournamentChangedSubscriptionResult = ApolloReactCommon.SubscriptionResult<TournamentChangedSubscription>;
export const SetTournamentStatusDocument = gql`
    mutation setTournamentStatus($tournamentId: ID!, $status: TournamentStatus!, $ticketId: ID, $verdict: String) {
  setTournamentStatus(
    tournamentId: $tournamentId
    status: $status
    ticketId: $ticketId
    verdict: $verdict
  ) {
    id
    publishedAt
    status
  }
}
    `;
export type SetTournamentStatusMutationFn = ApolloReactCommon.MutationFunction<SetTournamentStatusMutation, SetTournamentStatusMutationVariables>;

/**
 * __useSetTournamentStatusMutation__
 *
 * To run a mutation, you first call `useSetTournamentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTournamentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTournamentStatusMutation, { data, loading, error }] = useSetTournamentStatusMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *      status: // value for 'status'
 *      ticketId: // value for 'ticketId'
 *      verdict: // value for 'verdict'
 *   },
 * });
 */
export function useSetTournamentStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTournamentStatusMutation, SetTournamentStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetTournamentStatusMutation, SetTournamentStatusMutationVariables>(SetTournamentStatusDocument, options);
      }
export type SetTournamentStatusMutationHookResult = ReturnType<typeof useSetTournamentStatusMutation>;
export type SetTournamentStatusMutationResult = ApolloReactCommon.MutationResult<SetTournamentStatusMutation>;
export type SetTournamentStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTournamentStatusMutation, SetTournamentStatusMutationVariables>;
export const TournamentTicketChangedDocument = gql`
    subscription TournamentTicketChanged($tournamentId: ID!) {
  ticketChanged(tournamentId: $tournamentId) {
    id
    type
    number
    assignee {
      id
      displayName
      linkedAccounts {
        avatar
        username
        discriminator
      }
    }
    reporter {
      id
      linkedAccounts {
        avatar
        username
        discriminator
      }
    }
    reported {
      id
      displayName
      linkedAccounts {
        avatar
        username
        discriminator
      }
      participants {
        id
        tournamentId
      }
    }
    message
    verdict
    resolved
    matchBlocked
    match {
      id
      supportLink
      opponents {
        id
        name
        participants {
          id
          userId
        }
      }
      matchGames {
        id
        number
        submissions {
          id
          teamId
          matchGame {
            number
          }
          results {
            teamId
            score
          }
        }
      }
    }
    tournament {
      id
      hostUser {
        id
      }
    }
  }
}
    `;

/**
 * __useTournamentTicketChangedSubscription__
 *
 * To run a query within a React component, call `useTournamentTicketChangedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTournamentTicketChangedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentTicketChangedSubscription({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useTournamentTicketChangedSubscription(baseOptions: ApolloReactHooks.SubscriptionHookOptions<TournamentTicketChangedSubscription, TournamentTicketChangedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useSubscription<TournamentTicketChangedSubscription, TournamentTicketChangedSubscriptionVariables>(TournamentTicketChangedDocument, options);
      }
export type TournamentTicketChangedSubscriptionHookResult = ReturnType<typeof useTournamentTicketChangedSubscription>;
export type TournamentTicketChangedSubscriptionResult = ApolloReactCommon.SubscriptionResult<TournamentTicketChangedSubscription>;
export const TournamentInfoDocument = gql`
    query TournamentInfo($tournamentId: ID!) {
  tournament(tournamentId: $tournamentId) {
    id
    title
    description
    game {
      id
      title
    }
    gameMode {
      name
    }
    status
    date
    discordLink
    streamLink
    hostUser {
      id
      displayName
      linkedAccounts {
        avatar
      }
    }
    winnerTeam {
      name
    }
    platforms {
      name
    }
    region {
      name
    }
    language {
      name
    }
    rules
    prizePool
    maxPlayers
    checkinStart
    checkinEnd
    publishedAt
    participants {
      id
      isCheckedIn
      isRegistered
      isPlayer
      isHost
      isCurrentUser
      requestingMod
      deniedMod
      kicked
      team {
        id
        seed
      }
      roles {
        id
        type
      }
      user {
        id
        linkedAccounts {
          avatar
        }
        gameUsers {
          inGameName
          elo
          gameId
        }
      }
    }
  }
}
    `;

/**
 * __useTournamentInfoQuery__
 *
 * To run a query within a React component, call `useTournamentInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentInfoQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useTournamentInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TournamentInfoQuery, TournamentInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TournamentInfoQuery, TournamentInfoQueryVariables>(TournamentInfoDocument, options);
      }
export function useTournamentInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TournamentInfoQuery, TournamentInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TournamentInfoQuery, TournamentInfoQueryVariables>(TournamentInfoDocument, options);
        }
export type TournamentInfoQueryHookResult = ReturnType<typeof useTournamentInfoQuery>;
export type TournamentInfoLazyQueryHookResult = ReturnType<typeof useTournamentInfoLazyQuery>;
export type TournamentInfoQueryResult = ApolloReactCommon.QueryResult<TournamentInfoQuery, TournamentInfoQueryVariables>;
export const TournamentStagesInfoDocument = gql`
    query TournamentStagesInfo($tournamentId: ID!) {
  tournamentStages(tournamentId: $tournamentId) {
    id
    title
    type
    rounds {
      id
      format
      number
      locked
      status
      matches {
        id
        number
        status
        opponents {
          id
          name
          seed
          avatar
        }
        matchGames {
          finalResults {
            teamId
            score
          }
        }
      }
    }
  }
}
    `;

/**
 * __useTournamentStagesInfoQuery__
 *
 * To run a query within a React component, call `useTournamentStagesInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTournamentStagesInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTournamentStagesInfoQuery({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useTournamentStagesInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<TournamentStagesInfoQuery, TournamentStagesInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<TournamentStagesInfoQuery, TournamentStagesInfoQueryVariables>(TournamentStagesInfoDocument, options);
      }
export function useTournamentStagesInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TournamentStagesInfoQuery, TournamentStagesInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<TournamentStagesInfoQuery, TournamentStagesInfoQueryVariables>(TournamentStagesInfoDocument, options);
        }
export type TournamentStagesInfoQueryHookResult = ReturnType<typeof useTournamentStagesInfoQuery>;
export type TournamentStagesInfoLazyQueryHookResult = ReturnType<typeof useTournamentStagesInfoLazyQuery>;
export type TournamentStagesInfoQueryResult = ApolloReactCommon.QueryResult<TournamentStagesInfoQuery, TournamentStagesInfoQueryVariables>;
export const UserParticipantsDocument = gql`
    query userParticipants {
  userParticipants {
    id
    checkedInAt
    isPlayer
    isHost
    tournament {
      id
      status
      checkinStart
      checkinEnd
    }
  }
}
    `;

/**
 * __useUserParticipantsQuery__
 *
 * To run a query within a React component, call `useUserParticipantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserParticipantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserParticipantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserParticipantsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserParticipantsQuery, UserParticipantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<UserParticipantsQuery, UserParticipantsQueryVariables>(UserParticipantsDocument, options);
      }
export function useUserParticipantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserParticipantsQuery, UserParticipantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<UserParticipantsQuery, UserParticipantsQueryVariables>(UserParticipantsDocument, options);
        }
export type UserParticipantsQueryHookResult = ReturnType<typeof useUserParticipantsQuery>;
export type UserParticipantsLazyQueryHookResult = ReturnType<typeof useUserParticipantsLazyQuery>;
export type UserParticipantsQueryResult = ApolloReactCommon.QueryResult<UserParticipantsQuery, UserParticipantsQueryVariables>;
export const RemoveParticipantDocument = gql`
    mutation removeParticipant($tournamentId: ID!) {
  removeParticipant(tournamentId: $tournamentId) {
    id
    checkedInAt
    registeredAt
    isPlayer
    isCheckedIn
    roles {
      id
      type
    }
  }
}
    `;
export type RemoveParticipantMutationFn = ApolloReactCommon.MutationFunction<RemoveParticipantMutation, RemoveParticipantMutationVariables>;

/**
 * __useRemoveParticipantMutation__
 *
 * To run a mutation, you first call `useRemoveParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeParticipantMutation, { data, loading, error }] = useRemoveParticipantMutation({
 *   variables: {
 *      tournamentId: // value for 'tournamentId'
 *   },
 * });
 */
export function useRemoveParticipantMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveParticipantMutation, RemoveParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveParticipantMutation, RemoveParticipantMutationVariables>(RemoveParticipantDocument, options);
      }
export type RemoveParticipantMutationHookResult = ReturnType<typeof useRemoveParticipantMutation>;
export type RemoveParticipantMutationResult = ApolloReactCommon.MutationResult<RemoveParticipantMutation>;
export type RemoveParticipantMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveParticipantMutation, RemoveParticipantMutationVariables>;
export const GetGamesDocument = gql`
    query getGames {
  games {
    id
    title
    image {
      url
    }
  }
}
    `;

/**
 * __useGetGamesQuery__
 *
 * To run a query within a React component, call `useGetGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGamesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGamesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGamesQuery, GetGamesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGamesQuery, GetGamesQueryVariables>(GetGamesDocument, options);
      }
export function useGetGamesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGamesQuery, GetGamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGamesQuery, GetGamesQueryVariables>(GetGamesDocument, options);
        }
export type GetGamesQueryHookResult = ReturnType<typeof useGetGamesQuery>;
export type GetGamesLazyQueryHookResult = ReturnType<typeof useGetGamesLazyQuery>;
export type GetGamesQueryResult = ApolloReactCommon.QueryResult<GetGamesQuery, GetGamesQueryVariables>;
export const CreateTournamentDocument = gql`
    mutation createTournament($data: TournamentCreateInput!) {
  createTournament(data: $data) {
    id
    title
    date
    game {
      title
    }
    gameMode {
      name
    }
    hostUser {
      id
      displayName
      linkedAccounts {
        id
        avatar
      }
    }
    stages {
      type
    }
    platforms {
      name
    }
    region {
      name
    }
    language {
      name
    }
    playersCount
    maxPlayers
    description
    status
    completedRounds
    roundsCount
    activeRound {
      id
    }
  }
}
    `;
export type CreateTournamentMutationFn = ApolloReactCommon.MutationFunction<CreateTournamentMutation, CreateTournamentMutationVariables>;

/**
 * __useCreateTournamentMutation__
 *
 * To run a mutation, you first call `useCreateTournamentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTournamentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTournamentMutation, { data, loading, error }] = useCreateTournamentMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTournamentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTournamentMutation, CreateTournamentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateTournamentMutation, CreateTournamentMutationVariables>(CreateTournamentDocument, options);
      }
export type CreateTournamentMutationHookResult = ReturnType<typeof useCreateTournamentMutation>;
export type CreateTournamentMutationResult = ApolloReactCommon.MutationResult<CreateTournamentMutation>;
export type CreateTournamentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTournamentMutation, CreateTournamentMutationVariables>;
export const GetTournamentsDocument = gql`
    query getTournaments($userHasParticipantRoles: [ParticipantRoleType!]) {
  tournaments(userHasParticipantRoles: $userHasParticipantRoles) {
    id
    title
    date
    checkinStart
    checkinEnd
    game {
      title
    }
    gameMode {
      name
    }
    hostUser {
      displayName
      id
      linkedAccounts {
        id
        avatar
      }
    }
    stages {
      type
    }
    platforms {
      name
    }
    region {
      name
    }
    language {
      name
    }
    playersCount
    maxPlayers
    description
    status
    completedRounds
    roundsCount
    activeRound {
      id
    }
    userRoles
  }
}
    `;

/**
 * __useGetTournamentsQuery__
 *
 * To run a query within a React component, call `useGetTournamentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTournamentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTournamentsQuery({
 *   variables: {
 *      userHasParticipantRoles: // value for 'userHasParticipantRoles'
 *   },
 * });
 */
export function useGetTournamentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTournamentsQuery, GetTournamentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetTournamentsQuery, GetTournamentsQueryVariables>(GetTournamentsDocument, options);
      }
export function useGetTournamentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTournamentsQuery, GetTournamentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetTournamentsQuery, GetTournamentsQueryVariables>(GetTournamentsDocument, options);
        }
export type GetTournamentsQueryHookResult = ReturnType<typeof useGetTournamentsQuery>;
export type GetTournamentsLazyQueryHookResult = ReturnType<typeof useGetTournamentsLazyQuery>;
export type GetTournamentsQueryResult = ApolloReactCommon.QueryResult<GetTournamentsQuery, GetTournamentsQueryVariables>;