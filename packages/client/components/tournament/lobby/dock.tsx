import React, { ReactNode, useState } from 'react'

import styles from './dock.module.scss'
import classNames from 'classnames'
import { Match, Team } from '@app/generated/graphql'
import { Icon } from '@components/ui/icon'
import { Tooltip } from '@components/ui/tooltip'
import { Button } from '@components/ui/button'
import { Avatar } from '@components/ui/avatar'
import { PartialDeep } from 'type-fest'
import { ProgressCircle } from '@components/ui/progress'
import { Variants } from '@public/assets/icons/iconLib'
import { Loader } from '@components/ui/loader'
import { AuthUser } from '@hooks/useAuth'

interface DockTeamStatus {
  description?: ReactNode
  progress?: number | 'waiting' | 'done'
  icon?: {
    variant: Variants
    size?: number
    rotate?: number
    color?: string
  }
}

interface DockOptions {
  children?: ReactNode
  current?: Team | null
  opponent?: Team | null
  creator?: DockTeamStatus
  guest?: DockTeamStatus
  match: Match
  user: AuthUser
  phase?: string
  tooltip?: {
    title?: string
    content?: ReactNode
    width?: number
  }
  step?: Step
  instructions?: Instruction[]
  showGameInfo?: boolean
  showColoredTeamBorders?: boolean
  disclaimer?: DisclaimerProps
}

interface Step {
  number: number
  info: string
}
interface Instruction {
  info: ReactNode
  screenshot?: string
}
interface DisclaimerProps {
  title: ReactNode
  content: ReactNode
}

export const Dock = ({
  children,
  match,
  user,
  current,
  opponent,
  creator,
  guest,
  phase,
  step,
  instructions,
  showGameInfo,
  showColoredTeamBorders,
  tooltip,
  disclaimer,
}: DockOptions) => {
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const teams = match?.opponents

  const isInMatch = Boolean(
    match?.opponents?.find((team) =>
      team.participants
        .map(({ user, kicked }) => (kicked ? null : user.id))
        .includes(user?.id ?? '')
    )
  )

  const currentTeam =
    current ?? isInMatch
      ? teams.find((team) =>
          team.participants.some(
            (participant) => participant.user.id === user?.id
          )
        ) ?? teams[0]
      : teams[0]

  const opponentTeam =
    opponent ?? isInMatch
      ? teams.find(
          (team) =>
            !team.participants.some(
              (participant) => participant.user.id === user?.id
            )
        ) ?? teams[1]
      : teams[1]

  const hasCreator = (team: Team): boolean =>
    team.participants.some((participant) => participant.isCreator)

  return (
    <div className={styles.wrapper}>
      <div className={styles.disclaimerWrapper}>
        {disclaimer && (
          <div className={styles.disclaimer}>
            <span className={styles.title}>{disclaimer?.title}</span>
            <p>{disclaimer?.content}</p>
          </div>
        )}
      </div>
      <div className={styles.dock}>
        <div className={styles.left}>
          <DockTeam
            type={hasCreator(currentTeam) ? 'Creator' : 'Guest'}
            team={currentTeam}
            status={hasCreator(currentTeam) ? creator : guest}
            className={classNames(styles.team, {
              [styles.teamBorder]: showColoredTeamBorders,
            })}
          />
        </div>

        <div className={styles.center}>
          <div className={styles.top}>
            <h1>{phase}</h1>
          </div>
          <div className={styles.main}>
            {step && (
              <div className={styles.step}>
                <div>
                  <span className={styles.stepNumber}>{step?.number ?? 1}</span>
                  <h2 className={styles.stepTitle}>{step?.info ?? ''}</h2>
                </div>

                {tooltip && (
                  <div className={styles.tooltip}>
                    <Tooltip
                      content={tooltip.content}
                      title={tooltip.title}
                      placement="right"
                      width={tooltip.width}
                    >
                      <Icon variant="info" color={styles.secondary} />
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
            <div className={styles.info}>{children}</div>
            {instructions && (
              <div
                className={classNames(styles.instructionButton, {
                  [styles.open]: instructionsOpen,
                })}
                onClick={() => setInstructionsOpen(!instructionsOpen)}
              >
                <Icon
                  variant="chevron"
                  size={0.75}
                  rotate={instructionsOpen ? 'down' : 'right'}
                  color={instructionsOpen ? styles.steel : styles.white}
                />
                <span>Instructions</span>
              </div>
            )}

            {showGameInfo && (
              <div className={styles.lobbyCode}>
                <span>
                  {match?.gameLobbyCode
                    ? `#${match.gameLobbyCode}`
                    : 'No Lobby available'}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <DockTeam
            type={hasCreator(opponentTeam) ? 'Creator' : 'Guest'}
            team={opponentTeam}
            status={hasCreator(opponentTeam) ? creator : guest}
            className={classNames(styles.team, {
              [styles.teamBorder]: showColoredTeamBorders,
            })}
          />
        </div>
      </div>
      <Instructions
        step={step ?? { number: 1, info: 'Do the things' }}
        instructions={instructions}
        open={instructionsOpen}
      />
    </div>
  )
}

const DockTeam = ({
  type,
  status,
  className,
  team,
}: {
  type: string
  team: PartialDeep<Team>
  status?: DockTeamStatus
  className?: string
}) => (
  <div className={className}>
    <Avatar
      className={styles.teamIcon}
      size={8}
      userAccount={
        team.participants?.find(
          (participant) => participant?.id === team.leaderId
        )?.user?.linkedAccounts?.[0]
      }
    />
    <div className={styles.info}>
      <div className={styles.details}>
        <h2>{type}</h2>
        <h1>{team.name || 'No Team'}</h1>
      </div>
      {status && (
        <div className={styles.status}>
          {status.icon &&
            (typeof status.progress === 'number' ? (
              <ProgressCircle
                percent={status.progress}
                size={1.5}
                progressColor={styles.white}
                icon={{ variant: status.icon.variant, color: 'white' }}
                strokeWidth={0.125}
              />
            ) : (
              <div className={styles.waitingStatus}>
                <Loader size={1.5} done={status.progress === 'done'} />
                <Icon
                  color="white"
                  size={0.75}
                  variant={status.icon.variant}
                  rotate={status.icon.rotate}
                />
              </div>
            ))}

          <span>{status.description}</span>
        </div>
      )}
    </div>
  </div>
)

const Instructions = ({
  step,
  open,
  instructions,
}: {
  step: Step
  open: boolean
  instructions?: Instruction[]
}) => {
  const [page, setPage] = useState(0)

  if (!instructions || !open) return null

  const showBack = instructions.length > 1 && page > 0
  const showContinue = instructions.length > 1 && page < instructions.length - 1

  return (
    <div className={styles.instructions}>
      <Button
        variant="ghost"
        className={classNames({ [styles.hidden]: !showBack })}
        onClick={() => page > 0 && setPage(page - 1)}
      >
        <Icon variant="chevron" rotate="left" />
      </Button>
      <div className={styles.imageWrapper}>
        {instructions[page].screenshot && (
          <img src={instructions[page].screenshot} alt="screenshot" />
        )}
      </div>

      <div
        className={`${styles.content} ${
          instructions[page].screenshot ? '' : styles.wide
        }`}
      >
        <div className={styles.step}>
          <span>{page + 1}</span>
          <h3>{step.info}</h3>
        </div>
        <div className={styles.description}>{instructions[page].info}</div>
        {instructions.length > 1 && (
          <span className={styles.pageIndicator}>{`${page + 1}/${
            instructions.length
          }`}</span>
        )}
      </div>

      <Button
        variant="ghost"
        className={classNames({ [styles.hidden]: !showContinue })}
        onClick={() => page < instructions.length - 1 && setPage(page + 1)}
      >
        <Icon variant="chevron" rotate="right" />
      </Button>
    </div>
  )
}
