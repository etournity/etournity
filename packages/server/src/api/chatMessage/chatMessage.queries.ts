import { extendType, idArg, nonNull } from 'nexus'

export const ChatMessageQueries = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('chatRoomMessages', {
      type: 'ChatMessage',
      args: {
        chatRoomId: nonNull(idArg()),
      },
      resolve: (_, { chatRoomId }, { prisma }) =>
        prisma.chatMessage.findMany({
          where: { chatRoomId },
          orderBy: { createdAt: 'asc' },
          include: { author: true },
        }),
    })
  },
})
