import React, { useEffect, useState } from 'react'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { ProgressCircle } from '@components/ui/progress'
import { Tooltip } from '@components/ui/tooltip'
import {
  Participant,
  ParticipantRoleType,
  StageType,
  Tournament,
  TournamentStatus,
} from '@generated/graphql'
import { Variants } from '@public/assets/icons/iconLib'
import dayjs from 'dayjs'
import CopyToClipboard from 'react-copy-to-clipboard'
import { PartialDeep } from 'type-fest'
import styles from './tournamentInfoSummary.module.scss'
import classNames from 'classnames'
import Link from 'next/link'

export interface TournamentInfoSummaryProps {
  tournament: PartialDeep<Tournament>
  players: Array<PartialDeep<Participant>>
  currentParticipant?: PartialDeep<Participant>
  openEditSettingsModal?: () => void
}

export enum InfoSummaryStage {
  PUBLISH = 'publish',
  REGISTER = 'register',
  CHECKIN = 'checkin',
  BRACKETS = 'brackets',
}

export const TournamentInfoSummary: React.FC<TournamentInfoSummaryProps> = ({
  tournament,
  players,
  currentParticipant,
  openEditSettingsModal,
}) => {
  const [stage, setStage] = useState(InfoSummaryStage.BRACKETS)
  const [copy, setCopy] = useState('Click to copy!')
  const [now, setNow] = useState(dayjs())

  useEffect(() => {
    if (tournament.status === TournamentStatus.Draft)
      setStage(InfoSummaryStage.PUBLISH)
    else if (tournament.status === TournamentStatus.Published) {
      if (now.isBefore(tournament.checkinStart))
        setStage(InfoSummaryStage.REGISTER)
      else setStage(InfoSummaryStage.CHECKIN)
    } else setStage(InfoSummaryStage.BRACKETS)
  }, [tournament, now])

  useEffect(() => {
    const interval = setInterval(() => {
      if (now.isBetween(tournament.publishedAt, tournament.date, 'seconds')) {
        setNow(dayjs())
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  return (
    <div className={styles.infoSummary}>
      <div className={styles.title}>{tournament.title}</div>
      <div
        className={classNames(styles.links, {
          [styles.disabled]: tournament.status === TournamentStatus.Draft,
        })}
      >
        <div
          onClick={() => setCopy('Copied!')}
          onMouseLeave={() => {
            setTimeout(() => {
              setCopy('Click to copy!')
            }, 200)
          }}
        >
          <CopyToClipboard
            text={
              stage === InfoSummaryStage.PUBLISH
                ? ''
                : `${window.location.origin}/tournament/${tournament.id}`
            }
          >
            <div>
              <Tooltip
                className={styles.tooltip}
                content={
                  stage === InfoSummaryStage.PUBLISH
                    ? 'Publish tournament to get invite link'
                    : copy
                }
                backgroundColor={styles.ashBlack}
              >
                <span className={styles.link}>
                  <Icon
                    className={styles.icon}
                    variant="copy"
                    color={styles.primary}
                    size={1}
                  />
                  Copy Invite Link
                </span>
              </Tooltip>
            </div>
          </CopyToClipboard>
        </div>
        <Tooltip
          className={styles.tooltip}
          content={
            stage === InfoSummaryStage.PUBLISH
              ? 'Info page is created after publishing!'
              : null
          }
          disabled={stage !== InfoSummaryStage.PUBLISH}
          backgroundColor={styles.ashBlack}
        >
          <div>
            <Link
              passHref
              href={
                stage === InfoSummaryStage.PUBLISH
                  ? '#'
                  : `/tournament/${tournament?.id}`
              }
            >
              <span className={styles.link}>
                <Icon
                  className={styles.icon}
                  variant="infoPageFull"
                  color={styles.primary}
                  size={1}
                />
                Go to Info-Page
              </span>
            </Link>
          </div>
        </Tooltip>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.platforms}>
            {tournament.platforms?.map((platform) => (
              <Icon
                key={platform?.code}
                variant={(platform?.name?.toLowerCase() as Variants) ?? 'info'}
              />
            ))}
          </div>
          <div className={styles.mode}>
            {tournament.stages?.[0]?.type === StageType.Single &&
              'Single Elimination'}
            {tournament?.gameMode?.name && ` - ${tournament?.gameMode?.name}`}
          </div>
          <Tooltip
            className={styles.tooltip}
            content={`The settings can't be changed after publishing.`}
            backgroundColor={styles.ashBlack}
            disabled={stage === InfoSummaryStage.PUBLISH}
          >
            <Button
              disabled={
                stage !== InfoSummaryStage.PUBLISH ||
                currentParticipant?.roles?.some(
                  (role) =>
                    role?.type === ParticipantRoleType.Host ||
                    role?.type === ParticipantRoleType.Admin
                )
              }
              variant="secondary"
              className={styles.settings}
              onClick={openEditSettingsModal}
            >
              EDIT TOURNAMENT SETTINGS
            </Button>
          </Tooltip>
        </div>
        <div className={styles.status}>
          {stage === InfoSummaryStage.REGISTER ||
          stage === InfoSummaryStage.CHECKIN ? (
            <ProgressCircle
              size={3}
              progressColor={styles.primary}
              descriptionPlacement="bottom"
              icon={{ variant: 'people' }}
              percent={
                stage === InfoSummaryStage.REGISTER && tournament.maxPlayers
                  ? ((players?.length ?? 0) / tournament.maxPlayers) * 100
                  : players
                  ? (players.filter((player) => player?.isCheckedIn).length /
                      players.length) *
                    100
                  : 0
              }
              description={
                <p className={styles.description}>
                  {stage === InfoSummaryStage.REGISTER
                    ? `${players?.length} / ${tournament.maxPlayers}`
                    : `${
                        players?.filter((player) => player?.isCheckedIn).length
                      } / ${players?.length}`}
                </p>
              }
            />
          ) : (
            <div className={styles.icon}>
              <Icon variant="people" />
            </div>
          )}
          <div>
            <div className={styles.playersCount}>
              {stage === InfoSummaryStage.BRACKETS && !tournament.activeRound
                ? players.filter((player) => player?.isCheckedIn).length
                : stage === InfoSummaryStage.PUBLISH
                ? tournament.maxPlayers
                : stage === InfoSummaryStage.BRACKETS
                ? tournament.activeRound?.playersInRound
                : null}
            </div>
            <div className={styles.stage}>
              {stage === InfoSummaryStage.REGISTER
                ? 'Registered'
                : stage === InfoSummaryStage.CHECKIN ||
                  (stage === InfoSummaryStage.BRACKETS &&
                    !tournament.activeRound)
                ? 'Checked-In'
                : stage === InfoSummaryStage.BRACKETS && tournament.activeRound
                ? 'Playing'
                : 'Max. Players'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
