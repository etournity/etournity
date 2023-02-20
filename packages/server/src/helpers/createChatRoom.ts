import {
  PrismaClient,
  Prisma,
  User,
  ChatRoom as ChatRoomModel,
} from '@prisma/client'
import { pubsub } from '../globals'

export interface CreateChatRoomArgs {
  name: string
  members?: User[] | null
  tournamentId?: string | null
}

export const createChatRoom = async (
  data: CreateChatRoomArgs,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never>
): Promise<ChatRoomModel> => {
  const chatRoom = await prisma.chatRoom.create({
    data: {
      name: data.name,
      members: {
        connect: data.members?.map((member) => ({ id: member.id })) ?? [],
      },
      tournament: data.tournamentId
        ? { connect: { id: data.tournamentId } }
        : undefined,
    },
  })

  const tournament = await prisma.tournament.findUnique({
    where: { id: data.tournamentId ?? '' },
  })

  await pubsub.publish(
    'Tournament',
    tournament?.id,
    'createChatRoom',
    {
      ...tournament,
      chatRoom,
    },
    true
  )
  return chatRoom
}
