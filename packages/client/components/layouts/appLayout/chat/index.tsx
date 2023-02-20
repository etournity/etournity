import {
  Box,
  Paper,
  Select,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material'
import React, { useState } from 'react'
import styles from './chat.module.scss'
import classNames from 'classnames'
import { ArrowBack, ChatBubble } from '@mui/icons-material'
import { ChatMessage } from './chatMessage'
import { MessageInput } from './messageInput'
import { useChatRooms } from '@hooks/useChatRooms'
import {
  ChatRoomMessagesQuery,
  ChatRoomMessagesDocument,
  useCreateMessageMutation,
} from '@generated/graphql'
import { scrollToElementId } from '@utils/scroll'
import { useAuth } from '@hooks/useAuth'
import { DiscordLoginButton } from '@components/actions/discordLoginButton'

export const Chat: React.FC = () => {
  const {
    chatOpen,
    openChat,
    closeChat,
    chatRoomOpen,
    openChatRoom,
    closeChatRoom,
    activeChatRoom,
    tournaments,
    filteredChatRooms,
  } = useChatRooms()
  const { user } = useAuth()
  const [activeTournament, setActiveTournament] = useState<string | null>(
    tournaments.length === 1 ? tournaments[0].id ?? null : null
  )
  const [message, setMessage] = useState<string>('')

  const handleMessageSubmit = () => {
    const newMessage = message.replaceAll(/(?:[\t ]*(?:\r?\n|\r))+$/g, '')
    if (newMessage.length > 0 && activeChatRoom) {
      createMessage({
        variables: {
          chatRoomId: activeChatRoom.id ?? '',
          content: newMessage,
        },
      }).then(() => {
        scrollToElementId('chat-scroll-ref')
      })
    }

    setMessage('')
  }

  const [createMessage] = useCreateMessageMutation({
    onError: console.error,
    update: (cache, { data: createData }) => {
      if (!createData?.createChatMessage) return

      const newMessage = createData.createChatMessage
      cache.updateQuery<ChatRoomMessagesQuery>(
        {
          query: ChatRoomMessagesDocument,
          variables: { chatRoomId: newMessage.chatRoomId },
        },
        (data) => ({
          chatRoomMessages: data?.chatRoomMessages
            ? [...data.chatRoomMessages, newMessage]
            : [newMessage],
        })
      )
    },
  })

  const tournamentChatRooms = filteredChatRooms(
    (chatRoom) =>
      chatRoom.tournamentId ===
      (tournaments.length === 1 ? tournaments[0].id : activeTournament)
  )
  return (
    <>
      <Box
        className={classNames(styles.activator, { [styles.open]: chatOpen })}
        onClick={() => {
          if (chatOpen) {
            closeChat()
          } else {
            openChat()
          }
        }}
      >
        <ChatBubble />
      </Box>
      <Paper
        className={classNames(styles.chat, { [styles.open]: chatOpen })}
        sx={{
          width: { xs: '100%', md: '20rem' },
          right: { xs: '-100%', md: '-20rem' },
        }}
      >
        <Box className={styles.header}>
          <Typography variant="label" className={styles.title}>
            Select A Chat Room
          </Typography>
        </Box>
        {user ? (
          <>
            <Box className={styles.selector}>
              <FormControl fullWidth>
                <InputLabel id="tournament-selection-label">
                  Tournament Selection
                </InputLabel>
                <Select
                  fullWidth
                  labelId="tournament-selection-label"
                  label="Tournament Selection"
                  value={
                    tournaments.length === 1
                      ? tournaments[0].id
                      : activeTournament ?? ''
                  }
                  onChange={(e) => setActiveTournament(e.target.value)}
                >
                  {tournaments ? (
                    tournaments.map((tournament) => (
                      <MenuItem key={tournament.id} value={tournament.id ?? ''}>
                        {tournament.title}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No Tournaments available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box className={styles.chatList}>
              {tournamentChatRooms?.map((chatRoom) => {
                if (!chatRoom) return null
                return (
                  <Box
                    key={chatRoom.id}
                    className={styles.chatRoomItem}
                    onClick={() => {
                      openChatRoom(chatRoom.id)
                    }}
                  >
                    {chatRoom.name}
                  </Box>
                )
              })}
            </Box>
          </>
        ) : (
          <Box className={styles.login}>
            <Typography variant="titleSmall">
              Please log in to access chats.
            </Typography>
            <DiscordLoginButton className={styles.discordButton} />
          </Box>
        )}
      </Paper>
      <Paper
        className={classNames(styles.chatRoom, {
          [styles.open]: chatRoomOpen,
        })}
        sx={{
          width: { xs: '100%', md: '20rem' },
          right: { xs: '-100%', md: '-20rem' },
        }}
      >
        <Box className={styles.header}>
          <IconButton
            sx={{ width: 32, height: 32 }}
            onClick={() => closeChatRoom()}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="label" className={styles.title}>
            {activeChatRoom?.name}
          </Typography>
        </Box>
        <Box className={styles.messageList}>
          {activeChatRoom?.messages?.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              author={message.author}
              createdAt={message.createdAt}
            />
          ))}
          <Box id="chat-scroll-ref" />
        </Box>
        <MessageInput
          id="chat-message-input"
          variant="outlined"
          value={message}
          handleSubmit={handleMessageSubmit}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Paper>
    </>
  )
}
