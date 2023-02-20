import React from 'react'
import { Box, Typography, Button, Tooltip } from '@mui/material'
import { Participant, Tournament, TournamentStatus } from '@generated/graphql'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import styles from './registration.module.scss'

import classNames from 'classnames'
import { useRegistration } from '@hooks/useRegistration'
import { AuthFlow } from '../authFlow'
import { authVar } from '@state/authVar'
import { HostHubButton } from './hostHubButton'
import { useChatRooms } from '@hooks/useChatRooms'

interface RegistrationProps {
  tournament: Tournament | undefined
  currentParticipant: Participant | undefined
  bracketsReady: boolean
  userIsRegistered: boolean
  userIsStaff: boolean
  isMobile: boolean
}

export const Registration: React.FC<RegistrationProps> = ({
  tournament,
  currentParticipant,
  userIsRegistered,
  bracketsReady,
  userIsStaff,
  isMobile,
}) => {
  const {
    registrationState,
    authModal,
    setAuthModal,
    removeParticipant,
  } = useRegistration(tournament, currentParticipant, bracketsReady ?? false)

  const { chatOpen } = useChatRooms()

  return (
    <>
      {isMobile ? (
        <Box
          className={classNames(styles.mobileRegistration, {
            [styles.hiddenDown]: !registrationState?.status,
            [styles.hiddenLeft]: chatOpen,
          })}
        >
          {registrationState?.status && (
            <Box
              className={classNames(
                styles.status,
                styles.mobile,
                styles[registrationState.statusColor ?? 'primary']
              )}
            >
              {registrationState?.statusIcon}
              <Typography variant="label">
                {registrationState?.status}
              </Typography>
            </Box>
          )}
          {userIsRegistered && currentParticipant?.isPlayer && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToAppIcon />}
              className={classNames(styles.leaveButton, styles.mobile)}
              onClick={() => removeParticipant()}
            />
          )}

          <Button
            variant="contained"
            className={styles.mobileAction}
            {...registrationState?.buttonProps}
            onClick={(e) => {
              registrationState?.buttonProps?.onClick?.(e)
            }}
          >
            {registrationState?.buttonLabel}
          </Button>
        </Box>
      ) : (
        <Box
          className={styles.registration}
          sx={{ width: { md: 270, lg: 277, xl: 360 } }}
        >
          <Box sx={{ flex: 1 }}>
            {registrationState?.status && (
              <Box
                className={classNames(
                  styles.status,
                  styles[registrationState.statusColor ?? 'primary']
                )}
              >
                {registrationState?.statusIcon}
                <Typography variant="label">
                  {registrationState?.status}
                </Typography>
              </Box>
            )}
            <Tooltip
              placement="top"
              title={registrationState?.disabledTooltip ?? ''}
              disableHoverListener={
                !registrationState?.buttonProps.disabled ||
                !registrationState?.disabledTooltip
              }
            >
              <span>
                <Button
                  variant="contained"
                  className={styles.action}
                  {...registrationState?.buttonProps}
                  onClick={(e) => {
                    registrationState?.buttonProps?.onClick?.(e)
                  }}
                >
                  {registrationState?.buttonLabel}
                </Button>
              </span>
            </Tooltip>
          </Box>
          {userIsRegistered && currentParticipant?.isPlayer && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToAppIcon />}
              className={styles.leaveButton}
              onClick={() => removeParticipant()}
            />
          )}
          <HostHubButton
            variant="contained"
            tournamentId={tournament?.id}
            isStaff={userIsStaff}
            requestingMod={currentParticipant?.requestingMod ?? false}
            deniedMod={currentParticipant?.deniedMod ?? false}
            hideButton={
              tournament?.status
                ? [
                    TournamentStatus.Cancelled,
                    TournamentStatus.Finished,
                  ].includes(tournament?.status)
                : true
            }
            onRequest={() => setAuthModal({ active: true, path: 'moderator' })}
          />
        </Box>
      )}
      <AuthFlow
        isLoggedIn={authVar().authenticated ?? false}
        tournament={tournament}
        currentParticipant={currentParticipant}
        bracketsReady={bracketsReady ?? false}
        modalActive={authModal.active}
        path={authModal.path}
        onClose={() =>
          setAuthModal((prev) => ({ active: false, path: prev.path }))
        }
      />
    </>
  )
}
