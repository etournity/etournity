import { objectType } from 'nexus'
import { ParticipantRole } from 'nexus-prisma'

export const ParticipantRoleType = objectType({
  name: ParticipantRole.$name,
  definition(t) {
    t.field(ParticipantRole.id)
    t.field(ParticipantRole.type)
    t.field(ParticipantRole.participant)
    t.field(ParticipantRole.participantId)
  },
})
