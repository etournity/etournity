import React, { useState, useEffect } from 'react'
import styles from './chatMessage.module.scss'
import { Box, Typography, Avatar } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface MessageAuthor {
  id: string
  displayName: string
  linkedAccounts: Array<{
    id: string
    avatar?: string | null | undefined
  }>
}
interface ChatMessageProps {
  content: string
  createdAt: string
  author: MessageAuthor
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  createdAt,
  author,
}) => {
  const [timestamp, setTimestamp] = useState(dayjs(createdAt).fromNow())
  const authorName = author.displayName

  const authorAvatar = author.linkedAccounts[0].avatar ?? undefined
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(dayjs(createdAt).fromNow())
    }, 60000)
    return () => clearInterval(interval)
  })
  return (
    <Box className={styles.message}>
      <Box className={styles.author}>
        <Avatar sx={{ width: 24, height: 24 }} src={authorAvatar} />
        <Typography className={styles.authorName} fontWeight={700}>
          {authorName ?? 'Author'}
        </Typography>
        <Typography className={styles.messageTimestamp} variant="label">
          {timestamp}
        </Typography>
      </Box>
      <Typography className={styles.messageContent}>
        {content ?? 'Message Content'}
      </Typography>
    </Box>
  )
}
