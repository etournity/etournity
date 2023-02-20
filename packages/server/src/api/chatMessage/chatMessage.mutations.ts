import { extendType, nonNull, stringArg } from 'nexus'
import { ChatRoom, ChatMessage } from 'nexus-prisma'

export const ChatMessageMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createChatMessage', {
      type: ChatMessage.$name,
      args: {
        chatRoomId: nonNull(stringArg()),
        content: nonNull(stringArg()),
      },
      resolve: async (_, { chatRoomId, content }, { prisma, pubsub, user }) => {
        const message = await prisma.chatMessage.create({
          data: {
            createdAt: new Date(),
            content,
            author: { connect: { id: user.id } },
            chatRoom: { connect: { id: chatRoomId } },
          },
        })
        const chatRoom = await prisma.chatRoom.findUnique({
          where: { id: chatRoomId },
          include: { messages: true },
        })
        await pubsub.publish(ChatRoom.$name, chatRoomId, 'createChatMessage', {
          ...chatRoom,
          messages: chatRoom?.messages
            ? [...chatRoom.messages, message]
            : [message],
        })
        return message
      },
    })
  },
})
