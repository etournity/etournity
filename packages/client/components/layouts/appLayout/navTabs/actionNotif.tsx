import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import styles from './actionNotif.module.scss'
import classNames from 'classnames'
import { MatchStatus } from '@generated/graphql'
import { useActiveMatch } from '@hooks/useActiveMatch'
import TimerOutlined from '@mui/icons-material/TimerOutlined'
import dayjs from 'dayjs'

interface ActionNotifProps {
  children: ReactElement
  isActive: boolean
  content?: ReactNode
  progress?: number
}

export const ActionNotif: React.FC<ActionNotifProps> = ({
  children,
  content,
  isActive,
  progress,
}) => {
  if (!content) return children

  return (
    <Box className={styles.notifRoot}>
      {children}
      <Box
        className={classNames(styles.actionNotiv, {
          [styles.isActive]: isActive,
        })}
      >
        <Box className={styles.relativeWrapper}>
          <Box className={styles.progressBack}>{content}</Box>
          {progress && (
            <Box
              className={styles.progressFront}
              sx={{ clipPath: `inset(0 0 0 ${progress}%)` }}
            >
              {content}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export const useMatchActionNotif = (): {
  notifContent: ReactNode | null
  notifProgress: number | undefined
} => {
  const activeMatch = useActiveMatch()
  const [now, setNow] = useState(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      if (dayjs(now).isBefore(match?.noShowTimer)) {
        setNow(dayjs())
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  if (!activeMatch) return { notifContent: null, notifProgress: undefined }

  const {
    match,
    participantCount,
    userReady,
    userIsCreator,
    allScoresSubmitted,
    userHasSubmitted,
    noShowMinutes,
  } = activeMatch

  const noShowStart = dayjs(match?.noShowTimer).subtract(
    noShowMinutes ?? 10,
    'minute'
  )

  const notifProgress =
    now > dayjs(match?.noShowTimer)
      ? 100
      : (dayjs(noShowStart).diff(dayjs(now)) /
          dayjs(noShowStart).diff(match?.noShowTimer)) *
        100

  const noShowCountdown = (noShowTimer: number) => {
    if (now > dayjs(noShowTimer)) return 'Missed Check-in'
    const diff = dayjs(dayjs(noShowTimer).diff(now))

    return (
      <>
        Ready?
        <TimerOutlined className={styles.timerIcon} />
        {diff.format('mm:ss')}
      </>
    )
  }

  let notifContent: ReactNode = null

  if (match.status === MatchStatus.Started) {
    notifContent = userReady
      ? `${match.readyChecks.length}/${participantCount} Ready`
      : match?.noShowTimer
      ? noShowCountdown(match?.noShowTimer)
      : 'Check In'
  }

  if (match.status === MatchStatus.PrepPhase) {
    notifContent = match.gameLobbyCode
      ? 'Join Lobby'
      : userIsCreator
      ? 'Submit Lobby Code'
      : 'Wait for Code'
  }

  if (match.status === MatchStatus.GamePhase) {
    notifContent = allScoresSubmitted
      ? 'Comparing Scores'
      : userHasSubmitted
      ? 'Waiting for Scores'
      : 'Submit Scores'
  }

  if (match.status === MatchStatus.Error) {
    notifContent = 'Resolving Issue'
  }

  return {
    notifContent: <Typography variant="label">{notifContent}</Typography>,
    notifProgress:
      match.status === MatchStatus.Started ? notifProgress : undefined,
  }
}
