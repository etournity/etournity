import React, { useEffect, useState, ReactNode, useCallback } from 'react'
import {
  Participant,
  Tournament,
  TournamentStatus,
  useCheckinParticipantMutation,
  useRemoveParticipantMutation,
} from '@generated/graphql'
import { ButtonProps } from '@mui/material/Button'

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'

import { BracketIcon } from '@public/assets/icons/customIconLib'
import { toast } from 'react-hot-toast'
import { useTime } from './useTime'

export interface RegistrationState {
  status?: string
  statusIcon?: ReactNode
  statusColor?: 'primary' | 'info' | 'error'
  buttonLabel: string
  disabledTooltip?: string
  buttonProps: ButtonProps
}

export const useRegistration = (
  tournament: Tournament | undefined,
  currentParticipant: Participant | undefined,
  bracketsReady: boolean
) => {
  const { now } = useTime()
  const [checkInParticipant] = useCheckinParticipantMutation({
    variables: { tournamentId: tournament?.id ?? '' },
    onError: (err) => {
      console.error(err)
      toast.error(err.message)
    },
  })
  const [removeParticipant] = useRemoveParticipantMutation({
    variables: { tournamentId: tournament?.id ?? '' },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    },
  })
  const [authModal, setAuthModal] = useState<{
    active: boolean
    path: 'moderator' | 'player'
  }>({ active: false, path: 'player' })

  const getRegistrationState = useCallback(
    (
      participant: Participant | undefined,
      tournament: Tournament | undefined,
      bracketsReady: boolean
    ): RegistrationState | null => {
      if (!tournament) return null

      const checkInOver = now.isAfter(tournament.checkinEnd)

      const checkInOpen = now.isBetween(
        tournament.checkinStart,
        tournament.checkinEnd
      )
      const registrationFull =
        (tournament?.participants?.filter((p) => p?.isPlayer)?.length ?? 0) >=
        (tournament?.maxPlayers ?? 0)

      const handleRegistration = () => {
        setAuthModal({ active: true, path: 'player' })
      }

      const handleCheckIn = () => {
        checkInParticipant()
      }

      if (
        participant?.isRegistered &&
        (participant?.isPlayer || participant?.isHost)
      ) {
        if (participant.isCheckedIn || participant?.isHost) {
          if (tournament.status === TournamentStatus.Started) {
            return {
              status: participant.kicked ? 'Kicked from Tournament' : undefined,
              statusIcon: participant.kicked ? (
                <RemoveCircleOutlineIcon />
              ) : (
                <PendingOutlinedIcon />
              ),
              statusColor: participant.kicked ? 'error' : 'primary',
              buttonLabel: 'Brackets',
              disabledTooltip: 'Brackets will be available soon',
              buttonProps: {
                startIcon: <BracketIcon />,
                disabled: !bracketsReady,
                href: `/tournament/${tournament.id}/brackets`,
              },
            }
          }

          return {
            status: participant.kicked
              ? 'Kicked from Tournament'
              : [
                  TournamentStatus.Finished,
                  TournamentStatus.Cancelled,
                ].includes(tournament.status)
              ? undefined
              : 'Checked In',
            statusIcon: participant.kicked ? (
              <RemoveCircleOutlineIcon />
            ) : (
              <HowToRegOutlinedIcon />
            ),
            statusColor: participant.kicked ? 'error' : 'primary',
            buttonLabel: 'Brackets',
            disabledTooltip: 'Brackets will be available soon',
            buttonProps: {
              startIcon: <BracketIcon />,
              disabled: !bracketsReady,
              href: `/tournament/${tournament.id}/brackets`,
            },
          }
        }

        return {
          status: participant.kicked
            ? 'Kicked from Tournament'
            : checkInOver
            ? 'Failed Check-in'
            : 'Registered',
          statusIcon: participant.kicked ? (
            <RemoveCircleOutlineIcon />
          ) : checkInOver ? (
            <CancelOutlinedIcon />
          ) : (
            <HowToRegOutlinedIcon />
          ),
          statusColor: participant.kicked || checkInOver ? 'error' : 'primary',
          buttonLabel: 'Check-in',
          disabledTooltip: checkInOpen
            ? undefined
            : checkInOver
            ? 'You have missed your chance to participate'
            : 'Check-in is not open yet',
          buttonProps: {
            startIcon: <CheckCircleOutlineIcon />,
            disabled: participant.kicked || !checkInOpen,
            onClick: handleCheckIn,
          },
        }
      }

      if (checkInOver) {
        return {
          buttonLabel: 'Brackets',
          disabledTooltip: 'Brackets will be available soon',
          buttonProps: {
            startIcon: <BracketIcon />,
            disabled: !bracketsReady,
            href: `/tournament/${tournament.id}/brackets`,
          },
        }
      }

      return {
        status: registrationFull ? 'Registration full' : undefined,
        buttonLabel: 'Register',
        buttonProps: {
          disabled: registrationFull,
          startIcon: <PersonOutlinedIcon />,
          onClick: handleRegistration,
        },
      }
    },
    [checkInParticipant, now]
  )

  const [
    registrationState,
    setRegistrationState,
  ] = useState<RegistrationState | null>(
    getRegistrationState(currentParticipant, tournament, bracketsReady)
  )

  useEffect(() => {
    setRegistrationState(
      getRegistrationState(currentParticipant, tournament, bracketsReady)
    )
  }, [currentParticipant, tournament, bracketsReady, getRegistrationState])

  return {
    registrationState,
    authModal,
    setAuthModal,
    removeParticipant,
  }
}
