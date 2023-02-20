import { ChatRoomType } from './chatRoom.type'
import { ChatRoomQueries } from './chatRoom.queries'
import { ChatRoomMutations } from './chatRoom.mutations'
import { ChatRoomSubscriptions } from './chatRoom.subscriptions'

export const ChatRoomSchema = [
  ChatRoomType,
  ChatRoomQueries,
  ChatRoomMutations,
  ChatRoomSubscriptions,
]
