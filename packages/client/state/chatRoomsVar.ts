import { makeVar } from '@apollo/client'
import { ChatMessage } from '@generated/graphql'

interface ChatMember {
  id: string
  displayName: string
}
export interface ChatRoomInfo {
  id: string
  name: string
  tournamentId?: string
  tournamentTitle?: string | null
  members?: ChatMember[] | null
  messages?: ChatMessage[] | null
}
export interface ChatStateVar {
  chatOpen: boolean
  chatRoomOpen: boolean
}

export const chatRoomsVar = makeVar<ChatRoomInfo[]>([])

const initialChatState: ChatStateVar = {
  chatOpen: false,
  chatRoomOpen: false,
}

export const chatStateVar = makeVar<ChatStateVar>(initialChatState)
