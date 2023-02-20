import React, { useState, useEffect, useCallback } from 'react'
import { Chip, ChipProps } from '@mui/material'
import { TournamentStatus } from '@generated/graphql'
import dayjs from 'dayjs'

interface TournamentStatusChipProps extends ChipProps {
  tournamentStatus: TournamentStatus | undefined
  checkinStart: Date
  checkinEnd: Date
  startDate?: Date
}

interface ChipStatus {
  label: string
  type: 'primary' | 'default' | 'error'
}

export const TournamentStatusChip: React.FC<TournamentStatusChipProps> = ({
  tournamentStatus,
  checkinStart,
  checkinEnd,
  startDate,
  ...rest
}) => {
  const getStatus = useCallback((): ChipStatus => {
    const checkInOpen = dayjs().isAfter(dayjs(checkinStart))
    const checkInOver = dayjs().isAfter(checkinEnd)
    const startingSoon = dayjs().isAfter(dayjs(startDate).subtract(5, 'minute'))

    if (tournamentStatus === TournamentStatus.Draft)
      return { label: 'Draft', type: 'default' }
    if (tournamentStatus === TournamentStatus.Finished)
      return { label: 'Finished', type: 'default' }
    if (tournamentStatus === TournamentStatus.Cancelled)
      return { label: 'Cancelled', type: 'error' }
    if (tournamentStatus === TournamentStatus.Started)
      return { label: 'Running', type: 'primary' }
    if (checkInOver) {
      return {
        label: 'Starting Soon',
        type: startingSoon ? 'error' : 'default',
      }
    }

    if (tournamentStatus === TournamentStatus.Published)
      return {
        label: checkInOpen ? 'Check-in open' : 'Registration',
        type: 'default',
      }

    return { label: 'Unknown', type: 'default' }
  }, [tournamentStatus, checkinStart, checkinEnd, startDate])

  const [status, setStatus] = useState<ChipStatus>(getStatus())

  useEffect(() => {
    setStatus(getStatus())
  }, [getStatus])
  return (
    <Chip
      label={status.label}
      color={status.type}
      variant={status.type === 'default' ? 'outlined' : 'filled'}
      {...rest}
    />
  )
}
