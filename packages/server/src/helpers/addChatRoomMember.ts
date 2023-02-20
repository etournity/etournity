import { PrismaClient, Prisma, ChatRoom as ChatRoomModel } from '@prisma/client'
import { PubSubHandler } from './pubSubHelper'

export interface AddChatRoomMemberArgs {
  chatRoomId: string
  userId: string
}

export const addChatRoomMember = async (
  data: AddChatRoomMemberArgs,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
  pubsub: PubSubHandler
): Promise<ChatRoomModel> => {
  const chatRoom = await prisma.chatRoom.update({
    where: { id: data.chatRoomId },
    data: {
      members: {
        connect: { id: data.userId },
      },
    },
  })
  await pubsub.publish('ChatRoom', chatRoom.id, 'addChatRoomMember', chatRoom)
  return chatRoom
}
