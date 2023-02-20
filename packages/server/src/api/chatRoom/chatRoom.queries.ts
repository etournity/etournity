import { extendType } from 'nexus'
import { ChatRoom } from 'nexus-prisma'

export const ChatRoomQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('relatedChatRooms', {
      type: ChatRoom.$name,
      resolve: (_, __, { prisma, user }) =>
        // Only return Chatrooms related to the current user
        prisma.chatRoom.findMany({
          where: {
            tournament: { participants: { some: { userId: user.id } } },
          },
          include: {
            members: true,
            messages: {
              orderBy: { createdAt: 'asc' },
              include: { author: true },
            },
          },
        }) ?? [],
    })
  },
})
