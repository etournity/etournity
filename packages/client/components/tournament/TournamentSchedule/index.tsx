import React from 'react'
import { Paper, Box, Typography, SxProps, Skeleton } from '@mui/material'
import classNames from 'classnames'
import { Tournament } from '@generated/graphql'
import dayjs from 'dayjs'
import styles from './tournamentSchedule.module.scss'
import {
  formatDuration,
  formatTime,
  getTimezoneOffsetInHours,
} from '@utils/time'
import { TournamentPhase } from './tournamentPhase'
interface TournamentScheduleProps {
  className?: string
  sx?: SxProps
  tournament?: Tournament
  bracketsReady: boolean
}

export const TournamentSchedule: React.FC<TournamentScheduleProps> = ({
  className,
  sx,
  tournament,
  bracketsReady,
}) => {
  const checkInDuration = dayjs(tournament?.checkinEnd).diff(
    dayjs(tournament?.checkinStart),
    'minute'
  )

  return (
    <Paper
      className={classNames(styles.schedule, className)}
      sx={{
        ...sx,
      }}
      elevation={0}
    >
      <TournamentPhase tournament={tournament} bracketsReady={bracketsReady} />
      <Box className={styles.lowerSchedule}>
        <Box>
          <Typography>Check-In Start</Typography>
          <Typography>
            {tournament ? (
              formatTime(tournament.checkinStart) ?? 'N/A'
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
        </Box>
        <Box>
          <Typography>Check-In Duration</Typography>
          <Typography>
            {tournament ? (
              formatDuration(checkInDuration) ?? 'N/A'
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
        </Box>
        <Box>
          <Typography>Check-In End</Typography>
          <Typography>
            {tournament ? (
              formatTime(tournament.checkinEnd) ?? 'N/A'
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
        </Box>
        <Box>
          <Typography>Start</Typography>
          <Typography>
            {tournament ? (
              formatTime(tournament.date) ?? 'N/A'
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', color: styles.muiOnSurfaceVariant }}>
        <Typography variant="label">
          Times shown in UTC {getTimezoneOffsetInHours()}
        </Typography>
      </Box>
    </Paper>
  )
}
