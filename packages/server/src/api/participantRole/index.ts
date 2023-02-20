import { ParticipantRoleType } from './participantRole.type'
import { ParticipantRoleQueries } from './participantRole.queries'
import { ParticipantRoleMutations } from './participantRole.mutations'

export const ParticipantRoleSchema = [
  ParticipantRoleType,
  ParticipantRoleQueries,
  ParticipantRoleMutations,
]
