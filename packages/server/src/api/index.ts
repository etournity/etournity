import { objectType, subscriptionType, enumType } from 'nexus'

import { UserSchema } from './user'
import { TournamentSchema } from './tournament'
import { TeamSchema } from './team'
import { PlatformSchema } from './platform'
import { RegionSchema } from './region'
import { ParticipantSchema } from './participant'
import { UserAccountSchema } from './userAccount'
import { GameSchema } from './game'
import { GameUserSchema } from './gameUser'
import { ImageSchema } from './image'
import { MatchSchema } from './match'
import { ReadyCheckSchema } from './readyCheck'
import { StageSchema } from './stage'
import { RoundSchema } from './round'
import { ResultSchema } from './result'
import { SubmissionSchema } from './submission'
import { MatchGameSchema } from './matchGame'
import { TicketSchema } from './ticket'
import { ParticipantRoleSchema } from './participantRole'
import { LanguageSchema } from './language'
import { SavestateSchema } from './savestate'
import { GameModeSchema } from './gameMode'
import {
  TournamentStatus,
  MatchStatus,
  ParticipantRoleType,
  RoundStatus,
  StageType,
  TicketType,
  GameStatus,
} from 'nexus-prisma'
import { ChatRoomSchema } from './chatRoom'
import { ChatMessageSchema } from './chatMessage'
// IMPORT-MARKER (newly generated resolvers will be added before this line)

const Query = objectType({
  name: 'Query',
  definition() {},
})

const Mutation = objectType({
  name: 'Mutation',
  definition() {},
})

const Subscription = subscriptionType({
  definition() {},
})

const enums = [
  enumType(TournamentStatus),
  enumType(MatchStatus),
  enumType(ParticipantRoleType),
  enumType(RoundStatus),
  enumType(StageType),
  enumType(TicketType),
  enumType(GameStatus),
]

export const types = [
  Query,
  Mutation,
  Subscription,
  ...enums,
  ...UserSchema,
  ...TournamentSchema,
  ...PlatformSchema,
  ...TeamSchema,
  ...RegionSchema,
  ...ParticipantSchema,
  ...UserAccountSchema,
  ...GameSchema,
  ...GameUserSchema,
  ...ImageSchema,
  ...MatchSchema,
  ...ReadyCheckSchema,
  ...StageSchema,
  ...RoundSchema,
  ...ResultSchema,
  ...SubmissionSchema,
  ...MatchGameSchema,
  ...TicketSchema,
  ...ParticipantRoleSchema,
  ...LanguageSchema,
  ...SavestateSchema,
  ...GameModeSchema,
  ...ChatRoomSchema,
  ...ChatMessageSchema,
  // TYPE-MARKER (newly generated resolvers will be added before this line)
]
