import { objectType } from 'nexus'
import { ChatRoom } from 'nexus-prisma'

export const ChatRoomType = objectType({
  name: ChatRoom.$name,
  definition(t) {
    t.field(ChatRoom.id)
    t.field(ChatRoom.name)
    t.field(ChatRoom.members)
    t.field(ChatRoom.tournament)
    t.field(ChatRoom.tournamentId)
    t.field(ChatRoom.messages)
    t.field(ChatRoom.archivedAt)
  },
})
