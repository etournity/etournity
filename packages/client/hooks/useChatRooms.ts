import { useState } from 'react'
import { chatRoomsVar, ChatRoomInfo, chatStateVar } from '@state/chatRoomsVar'
import {
  useChatRoomMessagesLazyQuery,
  ChatRoomMessagesQuery,
  ChatRoomMessagesDocument,
  useRelatedChatRoomsQuery,
  ChatMessage,
  useChatRoomChangedSubscription,
} from '@generated/graphql'
import { useReactiveVar } from '@apollo/client'
import { scrollToElementId } from '@utils/scroll'
import { useAuth } from './useAuth'
export const useChatRooms = () => {
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoomInfo | null>(
    null
  )
  const { authenticated } = useAuth()

  const focusMessageInput = () => {
    const messageInput = document.getElementById('chat-message-input')
    if (messageInput) {
      messageInput.focus()
    }
  }

  const updateChatSessionStorage = (chatRoomId: string | null) => {
    if (chatRoomId) {
      sessionStorage.setItem('activeChatRoom', chatRoomId)
    } else {
      sessionStorage.removeItem('activeChatRoom')
    }
  }

  const updateActiveChatRoom = (chatRoomId: string) => {
    setActiveChatRoom(
      chatRoomsVar().find((chatRoom) => chatRoom.id === chatRoomId) ?? null
    )
  }

  const openChatRoom = (chatRoomId: string) => {
    updateActiveChatRoom(chatRoomId)
    messagesQuery({ variables: { chatRoomId } }).then(() => {
      updateActiveChatRoom(chatRoomId)
      scrollToElementId('chat-scroll-ref', 'auto')
    })

    chatStateVar({ ...chatStateVar(), chatRoomOpen: true })
    focusMessageInput()
    updateChatSessionStorage(chatRoomId)
  }

  const openChat = () => {
    chatStateVar({ ...chatStateVar(), chatOpen: true })
    if (activeChatRoom) {
      openChatRoom(activeChatRoom.id)
    } else if (authenticated && sessionStorage.getItem('activeChatRoom')) {
      openChatRoom(sessionStorage.getItem('activeChatRoom') as string)
    }
  }

  const closeChatRoom = () => {
    setActiveChatRoom(null)
    chatStateVar({ ...chatStateVar(), chatRoomOpen: false })
    updateChatSessionStorage(null)
  }

  const closeChat = () => {
    chatStateVar({ ...chatStateVar(), chatOpen: false, chatRoomOpen: false })
  }

  const [messagesQuery] = useChatRoomMessagesLazyQuery({
    onError: console.error,
    onCompleted: (data) => {
      const chatRoomId =
        data.chatRoomMessages.find(
          (message) => message.chatRoomId !== undefined
        )?.chatRoomId ?? ''

      const updatedChatRooms = chatRoomsVar().map((chatRoom) =>
        chatRoom.id === chatRoomId
          ? { ...chatRoom, messages: data.chatRoomMessages as ChatMessage[] }
          : chatRoom
      )

      chatRoomsVar(updatedChatRooms)
      if (activeChatRoom) {
        const updatedActiveChatRoom = updatedChatRooms.find(
          (chatRoom) => chatRoom.id === activeChatRoom.id
        )
        if (updatedActiveChatRoom) {
          setActiveChatRoom(updatedActiveChatRoom)
        }
      }
    },
  })

  useRelatedChatRoomsQuery({
    skip: !authenticated,
    onCompleted: (data) => {
      const chatRooms = data.relatedChatRooms.map(
        (chatRoom): ChatRoomInfo => ({
          ...chatRoom,
          messages: [],
          tournamentId: chatRoom.tournament?.id,
          tournamentTitle: chatRoom.tournament?.title,
        })
      )
      chatRoomsVar(chatRooms ?? [])
    },
    onError: console.error,
  })
  useChatRoomChangedSubscription({
    skip: !activeChatRoom || !authenticated,
    variables: {
      chatRoomId: activeChatRoom?.id ?? '',
      fetchMessages: true,
    },
    onSubscriptionData: ({ subscriptionData, client }) => {
      const updatedChatRoom = subscriptionData?.data
        ?.chatRoomChanged as ChatRoomInfo
      chatRoomsVar(
        chatRoomsVar().map((chatRoom) =>
          chatRoom.id === updatedChatRoom?.id
            ? { ...chatRoom, ...updatedChatRoom }
            : chatRoom
        )
      )
      client.cache.updateQuery<ChatRoomMessagesQuery>(
        {
          query: ChatRoomMessagesDocument,
          variables: { chatRoomId: updatedChatRoom?.id },
        },
        (data) => ({
          chatRoomMessages: updatedChatRoom?.messages
            ? updatedChatRoom.messages
            : data?.chatRoomMessages ?? [],
        })
      )
      updateActiveChatRoom(updatedChatRoom?.id)
      scrollToElementId('chat-scroll-ref')
    },
  })
  const tournaments = chatRoomsVar().map((chatRoom) => ({
    id: chatRoom.tournamentId,
    title: chatRoom.tournamentTitle,
  }))

  const filteredChatRooms = (
    filterFunc?: (
      chatRoom: ChatRoomInfo,
      index?: number,
      array?: ChatRoomInfo[]
    ) => unknown
  ) => chatRoomsVar()?.filter(filterFunc ?? (() => true))

  return {
    openChat,
    closeChat,
    openChatRoom,
    closeChatRoom,
    activeChatRoom,
    chatRooms: useReactiveVar<ChatRoomInfo[]>(chatRoomsVar),
    chatOpen: useReactiveVar(chatStateVar).chatOpen,
    chatRoomOpen: useReactiveVar(chatStateVar).chatRoomOpen,
    tournaments,
    filteredChatRooms,
  }
}
