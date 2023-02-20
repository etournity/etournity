import React, {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'
import dayjs, { Dayjs } from 'dayjs'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { Countdown } from '@components/ui/time/countdown'
import styles from './tournamentPhase.module.scss'
import { RoundStatus, Tournament, TournamentStatus } from '@generated/graphql'
import classNames from 'classnames'
import { formatDuration, formatTime } from '@utils/time'
import { useTime } from '@hooks/useTime'

interface SchedulePhase {
  name: string
  content?: ReactNode
  contentType?: 'primary' | 'secondary' | 'error'
  bottom?: ReactNode
}
interface TournamentPhaseProps {
  tournament: Tournament | undefined
  bracketsReady: boolean
}

export const TournamentPhase: React.FC<TournamentPhaseProps> = ({
  tournament,
  bracketsReady,
}) => {
  const { now } = useTime()

  const tournamentDuration = dayjs(now).diff(dayjs(tournament?.date), 'minute')

  const activeRound = tournament?.stages
    ?.flatMap((stage) => stage.rounds)
    ?.find((round) =>
      round?.status === RoundStatus.Active ? round : undefined
    )

  const schedulePhases: SchedulePhase[] = useMemo(
    () => [
      {
        name: 'Check-in opens in',
        content: (
          <Box className={classNames(styles.content, styles.primary)}>
            <Countdown
              hideIcon
              endTime={tournament?.checkinStart}
              color="inherit"
            />
          </Box>
        ),
        bottom: formatTime(tournament?.checkinStart),
      },
      {
        name: 'Check-in open',
        content: (
          <Box className={classNames(styles.content, styles.primary)}>
            <Countdown
              hideIcon
              startTime={tournament?.checkinStart}
              endTime={tournament?.checkinEnd}
              color="inherit"
              format="mm:ss left"
            />
          </Box>
        ),
        bottom: formatTime(tournament?.checkinEnd),
      },
      {
        name: 'Starting Soon',
        content: bracketsReady ? (
          dayjs(now).isAfter(tournament?.date) ? (
            'Waiting for organizer to start'
          ) : (
            <Box className={classNames(styles.content, styles.secondary)}>
              <Countdown
                hideIcon
                className={styles.countdown}
                endTime={tournament?.date}
                color="inherit"
                format="mm:ss left"
              />
            </Box>
          )
        ) : (
          'Brackets are being generated'
        ),
        contentType: 'secondary',
        bottom: formatTime(tournament?.date),
      },
      {
        name: 'Running',
        content: `Round ${activeRound?.number ?? 0}/${
          tournament?.stages?.[0]?.rounds.length
        }`,
        contentType: 'secondary',
        bottom: `${formatDuration(tournamentDuration)} Uptime`,
      },
      {
        name: 'Finished',
        content: (
          <Box className={classNames(styles.content, styles.winner)}>
            <Typography>
              {tournament?.winnerTeam ? (
                <>
                  <b>{tournament?.winnerTeam?.name}</b>
                  {' won!'}
                </>
              ) : (
                'Tournament finished!'
              )}
            </Typography>
          </Box>
        ),
      },
      {
        name: 'Cancelled',
        content: 'Tournament has been cancelled',
        contentType: 'error',
      },
    ],
    [bracketsReady, now, tournamentDuration, tournament, activeRound?.number]
  )

  const getPhase = useCallback(
    (time: Dayjs) => {
      if (!tournament?.status) return null

      if (tournament.status === TournamentStatus.Cancelled) {
        return schedulePhases[5]
      }

      if (tournament.status === TournamentStatus.Finished) {
        return schedulePhases[4]
      }

      if (tournament.status === TournamentStatus.Started) {
        return schedulePhases[3]
      }

      if (dayjs(time).isAfter(tournament?.checkinEnd)) {
        return schedulePhases[2]
      }

      if (dayjs(time).isAfter(tournament?.checkinStart)) {
        return schedulePhases[1]
      }

      return schedulePhases[0]
    },
    [
      schedulePhases,
      tournament?.checkinStart,
      tournament?.checkinEnd,
      tournament?.status,
    ]
  )

  const [phase, setPhase] = useState<SchedulePhase | null>(getPhase(now))

  useEffect(() => {
    setPhase(getPhase(now))
  }, [now, getPhase])

  return (
    <Box className={styles.upperSchedule}>
      <Typography variant="title">
        {phase?.name ?? <Skeleton width={100} />}
      </Typography>
      {typeof phase?.content === 'string' || !phase?.content ? (
        <Box
          className={classNames(
            styles.content,
            styles[phase?.contentType ?? 'secondary']
          )}
        >
          {phase?.content ?? <Skeleton />}
        </Box>
      ) : (
        phase?.content
      )}
      <Typography>{phase?.bottom ?? ''}</Typography>
    </Box>
  )
}
