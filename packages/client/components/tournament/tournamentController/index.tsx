import { ConfirmationModal } from '@components/ui/confirmationModal'
import { Icon } from '@components/ui/icon'
import {
  Participant,
  ParticipantRoleType,
  Tournament,
  TournamentStatus,
} from '@generated/graphql'
import React, { useState, useEffect, ReactNode, SetStateAction } from 'react'
import { AddTime } from '../addTime'
import { TournamentSteps, Step } from '../tournamentSteps'
import styles from './tournamentController.module.scss'
import { PartialDeep } from 'type-fest'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Countdown } from '@components/ui/time'
import { Button } from '@components/ui/button'
import Link from 'next/link'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Loader } from '@components/ui/loader'
dayjs.extend(utc)

export interface TournamentControllerProps {
  tournament: PartialDeep<Tournament>
  className?: string
  onCheckInTimerEnd?: () => void
  onStartTournament?: (
    setLoading?: React.Dispatch<SetStateAction<boolean>>
  ) => void
  onForceEnd?: () => void
  onAddTimeCheckIn?: (time: Date) => void
  onAddTimeStart?: (time: Date) => void
  onModalPublish?: () => void
  openEditSettingsModal?: () => void
}

export const TournamentController: React.FC<TournamentControllerProps> = ({
  tournament,
  className,
  onCheckInTimerEnd,
  onStartTournament,
  onAddTimeCheckIn,
  onAddTimeStart,
  onModalPublish,
  onForceEnd,
  openEditSettingsModal,
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [confirmationModalActive, setConfirmationModalActive] = useState(false)
  const router = useRouter()
  const [now, setNow] = useState(dayjs())

  const checkInTimerEnd = () => {
    onCheckInTimerEnd?.()
    setActiveStep(activeStep + 1)
  }

  const startTournament = () => {
    setLoading(true)
    onStartTournament?.(setLoading)
    setActiveStep(activeStep + 1)
  }

  const moveForward = async () => {
    if (activeStep === 0) return setConfirmationModalActive(true)
    if (activeStep === 2) {
      if ((eligiblePlayers?.length ?? 0) < 2) {
        return onForceEnd?.()
      }

      await router.push(`/tournament/${tournament.id}/hub/generate`)
    }

    setActiveStep(activeStep + 1)
  }

  const publish = () => {
    setConfirmationModalActive(false)
    onModalPublish?.()
    setActiveStep(activeStep + 1)
  }

  const reviewSettings = () => {
    setConfirmationModalActive(false)
    openEditSettingsModal?.()
  }

  const daysToCheckIn = dayjs(tournament.checkinStart).diff(now, 'days', true)
  const showCheckInStartCountdown =
    dayjs(tournament.checkinStart).diff(now, 'minutes', true) < 15

  const daysToCheckInEnd = dayjs(tournament.checkinEnd).diff(now, 'days', true)
  const showCheckInEndCountdown =
    dayjs(tournament.checkinEnd).diff(now, 'minutes', true) < 15
  const isFinished = tournament.status === TournamentStatus.Finished
  const isCancelled = tournament.status === TournamentStatus.Cancelled
  const eligiblePlayers:
    | Array<PartialDeep<Participant> | undefined>
    | undefined = tournament.participants?.filter(
    (participant) =>
      participant?.isCheckedIn &&
      participant?.roles?.some(
        (role) => role?.type === ParticipantRoleType.Player
      )
  )

  const renderControl = (
    step: number
  ): { top: ReactNode; action: ReactNode; info: ReactNode } => {
    switch (step) {
      case 0:
        return { top: null, action: 'Publish Tournament', info: null }
      case 1:
        return {
          top: now.isAfter(dayjs(tournament.checkinStart)) && (
            <AddTime
              endDate={tournament.checkinEnd}
              onAddTime={(time) => onAddTimeCheckIn?.(time)}
            />
          ),
          action: (
            <div>
              {now.isBefore(dayjs(tournament.checkinStart)) ? (
                <>
                  <div>
                    Check-In starts
                    {daysToCheckIn > 1 && ' on'}
                    {showCheckInStartCountdown && ' in'}
                  </div>
                  {showCheckInStartCountdown ? (
                    <Countdown
                      className={styles.countdown}
                      format="mm:ss"
                      endTime={tournament.checkinStart}
                      color={styles.void}
                      iconSize={1}
                    />
                  ) : (
                    <span>
                      {dayjs(tournament.checkinStart).format(
                        daysToCheckIn > 1
                          ? 'DD.MM.YY | HH:mm (UTC Z)'
                          : daysToCheckIn === 1
                          ? '[Tomorrow] | HH:mm (UTC Z)'
                          : '[Today] | HH:mm (UTC Z)'
                      )}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div>
                    Check-In ends {daysToCheckInEnd > 1 && ' on'}
                    {showCheckInEndCountdown && ' in'}
                  </div>
                  {showCheckInEndCountdown ? (
                    <Countdown
                      className={styles.countdown}
                      format="mm:ss"
                      endTime={tournament.checkinEnd}
                      color={styles.void}
                      iconSize={1}
                      onEnd={checkInTimerEnd}
                    />
                  ) : (
                    <span>
                      {dayjs(tournament.checkinEnd).format(
                        daysToCheckInEnd > 1
                          ? 'DD.MM.YY | HH:mm (UTC Z)'
                          : daysToCheckInEnd === 1
                          ? '[Tomorrow] | HH:mm (UTC Z)'
                          : '[Today] | HH:mm (UTC Z)'
                      )}
                    </span>
                  )}
                </>
              )}
            </div>
          ),
          info: (
            <div>
              {dayjs(
                now.isBefore(dayjs(tournament.checkinStart))
                  ? tournament.checkinStart
                  : tournament.checkinEnd
              )
                .local()
                .format('DD.MM.YY | HH:mm (UTC Z)')}
            </div>
          ),
        }
      case 2:
        return {
          top: null,
          action:
            (eligiblePlayers?.length ?? 0) >= 2
              ? 'Generate and Publish Brackets'
              : 'Cancel Tournament',
          info:
            (eligiblePlayers?.length ?? 0) < 2 &&
            'Not enough players to start tournament!',
        }

      case 3:
        return {
          top: (
            <AddTime
              endDate={tournament.date}
              onAddTime={(time) => onAddTimeStart?.(time)}
            />
          ),
          action: (
            <div>
              {now.isBefore(tournament.date) ? (
                <>
                  <div>Starts in</div>
                  <Countdown
                    className={styles.countdown}
                    format="hh:mm:ss"
                    endTime={tournament.date}
                    color={styles.void}
                    iconSize={1}
                  />
                </>
              ) : (
                'Start Tournament'
              )}
            </div>
          ),
          info: (
            <div>
              {dayjs(tournament.date)
                .local()
                .format('DD.MM.YY | HH:mm (UTC Z)')}
            </div>
          ),
        }
      case 4:
        return {
          top: (
            <div className={styles.forceEnd} onClick={onForceEnd}>
              Force End
            </div>
          ),
          action: (
            <div className={styles.end}>
              The Tournament will end automatically
            </div>
          ),
          info: (
            <>
              <Icon size={2} variant="info" color={styles.middleGrey} />
              <div>
                It will end when all Matches are done and all Tickets are
                resolved
              </div>
            </>
          ),
        }
      default:
        return { top: null, action: null, info: null }
    }
  }

  useEffect(() => {
    if (tournament.status === TournamentStatus.Published) {
      setActiveStep(1)
      if (now.isAfter(dayjs(tournament.checkinEnd))) setActiveStep(2)
      if ((tournament.stages?.[0]?.rounds?.[0]?.matches?.length ?? 0) > 0)
        setActiveStep(3)
    }

    if (tournament.status === TournamentStatus.Started) setActiveStep(4)
  }, [tournament, activeStep, now])

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        (activeStep === 1 && now.isBefore(tournament.checkinEnd)) ||
        (activeStep === 3 && now.isBefore(tournament.date))
      ) {
        setNow(dayjs())
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  return (
    <div className={classNames(styles.tournamentController, className)}>
      <h1 className={styles.header}>Tournament Controller</h1>
      <div className={styles.main}>
        {isFinished || isCancelled ? (
          <div className={styles.endedWrapper}>
            <p
              className={classNames(styles.endedText, {
                [styles.finished]: isFinished,
                [styles.cancelled]: isCancelled,
              })}
            >
              <Icon
                variant={isFinished ? 'tick' : 'close'}
                size={1}
                color={isFinished ? styles.success : styles.error}
              />
              {`Tournament ${isFinished ? 'Finished' : 'Cancelled'}`}
            </p>
            <Link passHref href={`/tournament/${tournament.id}/`}>
              <Button variant="secondary">Go To Info-Page</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.steps}>
              <TournamentSteps activeStep={activeStep}>
                <Step name="Publish" />
                <Step name="Registr. & Check-in" />
                <Step name="Publish Brackets" />
                <Step name="Start" />
                <Step name="Stop" />
              </TournamentSteps>
            </div>
            <div className={styles.controls}>
              <div className={styles.top}>{renderControl(activeStep).top}</div>
              <div
                className={classNames(styles.actions, {
                  [styles.interactable]:
                    activeStep === 0 ||
                    activeStep === 2 ||
                    (activeStep === 3 && now.isAfter(tournament.date)),
                })}
                onClick={async () => {
                  if (activeStep === 0 || activeStep === 2) await moveForward()
                  if (activeStep === 3 && now.isAfter(tournament.date))
                    startTournament()
                }}
              >
                <div className={styles.loadingWrapper}>
                  {loading ? (
                    <Loader
                      color={styles.steel}
                      style={{ marginRight: '0.5rem' }}
                    />
                  ) : (
                    <div className={styles.loadingSpacer} />
                  )}
                  {renderControl(activeStep).action}
                </div>
              </div>
              <div className={styles.info}>
                {renderControl(activeStep).info}
              </div>
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        title="Are you sure you want to publish?"
        description="After publishing the tournament, you won't be able to edit the tournaments main settings."
        active={confirmationModalActive}
        className={styles.modal}
        primaryBtnName="Review Settings"
        secondaryBtnName="Publish"
        thirdBtnName="Cancel"
        onPrimary={() => reviewSettings()}
        onSecondaryAction={() => publish()}
        onCancel={() => setConfirmationModalActive(false)}
      />
    </div>
  )
}
