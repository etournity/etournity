import { objectType } from 'nexus'
import { ChatMessage } from 'nexus-prisma'

export const ChatMessageType = objectType({
  name: ChatMessage.$name,
  definition(t) {
    t.field(ChatMessage.id)
    t.field(ChatMessage.createdAt)
    t.field(ChatMessage.author)
    t.field(ChatMessage.authorId)
    t.field(ChatMessage.content)
    t.field(ChatMessage.chatRoomId)
    t.field(ChatMessage.chatRoom)
  },
})
