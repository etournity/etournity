import { ChatMessageType } from './chatMessage.type'
import { ChatMessageQueries } from './chatMessage.queries'
import { ChatMessageMutations } from './chatMessage.mutations'

export const ChatMessageSchema = [
  ChatMessageType,
  ChatMessageQueries,
  ChatMessageMutations,
]
