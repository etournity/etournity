import React, { useState, useEffect } from 'react'
import { Modal, ModalProps } from '@components/ui/modal'
import { Icon } from '@components/ui/icon'
import { Tooltip } from '@components/ui/tooltip'
import {
  Ticket,
  TicketType,
  useResetMatchMutation,
  useSetMatchWinnerMutation,
  useSetMatchResultsMutation,
  useCloseTicketMutation,
  useResolvePlayerReportMutation,
} from '@generated/graphql'
import { toast } from 'react-hot-toast'
import styles from './resolveModal.module.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classNames from 'classnames'
import {
  ResolveFormValues,
  ResolveTicketForm,
} from '@components/tournament/forms/resolveTicket'
import {
  ResolveScoreIssueForm,
  ScoreIssueFormValues,
} from '@components/tournament/forms/resolveScoreIssue'
import { PartialDeep, Except } from 'type-fest'

export interface ResolveModalProps
  extends Except<ModalProps, 'children' | 'onClose'> {
  ticket?: Ticket
  onClose?: () => void
  onError?: (error: Error) => void
}
export const ResolveModal: React.FC<ResolveModalProps> = ({
  active,
  onClose,
  onError,
  ticket,
}) => {
  const [copy, setCopy] = useState('Click to copy!')
  const [copyCount, setCopyCount] = useState(0)
  const [currentActive, setCurrentActive] = useState(active)

  useEffect(() => {
    setCurrentActive(active)
    if (copyCount === 1) setCopy('Link copied!')
    if (copyCount > 1) setCopy(`Link copied! (x${copyCount})`)
    if (copyCount === 5) setCopy('May the copy be with you!')
    if (copyCount === 6) setCopy('Another One!')
    if (copyCount === 7) setCopy("Got 'eeeem!")
    if (copyCount > 7) setCopy("Stop, he's already copied!")
  }, [copyCount, active, ticket])

  const [resolvePlayerReport] = useResolvePlayerReportMutation({
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    },
  })
  const [resetMatch] = useResetMatchMutation({
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    },
  })
  const [setWinner] = useSetMatchWinnerMutation({
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    },
  })
  const [setResults] = useSetMatchResultsMutation({
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    },
  })
  const [closeTicket] = useCloseTicketMutation({
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    },
  })

  if (!ticket) {
    toast.error('Unable to find ticket!')
    return null
  }

  const handleResolveSubmit = (data: ResolveFormValues, ticket: Ticket) => {
    if (data.action === 'kick' && data.target) {
      const partcipantToKick = ticket.reported?.participants.find(
        ({ tournamentId }) => tournamentId === ticket.tournament?.id
      )
      if (partcipantToKick) {
        resolvePlayerReport({
          variables: {
            participantId: partcipantToKick.id,
            ticketId: ticket.id,
            verdict:
              data.verdict ??
              `Participant ${ticket.reported?.displayName} was kicked.`,
          },
        })
      } else {
        onError?.(new Error('Participant to kick not found!'))
      }
    }

    if (data.action === 'reset' && ticket.id) {
      if (ticket.match?.id) {
        resetMatch({
          variables: {
            matchId: ticket.match.id,
            ticketId: ticket.id,
            verdict: data.verdict ?? 'Match was reset.',
          },
        })
      } else {
        onError?.(new Error('Unable to find match to reset!'))
      }
    }

    if (data.action === 'winner' && data.target && ticket.match?.id) {
      const winningTeam = ticket.match.opponents.find(
        ({ id }) => id === data.target
      )
      if (winningTeam) {
        setWinner({
          variables: {
            matchId: ticket.match.id,
            winnerId: data.target,
            ticketId: ticket.id,
            verdict:
              data.verdict ?? `Winner set by staff. ${winningTeam.name} won.`,
          },
        })
      } else {
        onError?.(new Error("Couldn't find winning team!"))
      }
    }

    if (data.action === 'dismiss' && ticket.id) {
      closeTicket({
        variables: { ticketId: ticket.id, verdict: 'Issue Dismissed' },
      })
    }

    setCurrentActive(false)
  }

  const handleScoreResolveSubmit = (
    data: ScoreIssueFormValues,
    ticket: PartialDeep<Ticket>
  ) => {
    if (!ticket.match?.id) {
      onError?.(new Error('Related match not found!'))
      return
    }

    if (data.winner) {
      setWinner({
        variables: {
          matchId: ticket.match?.id,
          winnerId: data.winner,
          ticketId: ticket.id,
          verdict: data.verdict,
        },
      })
    }

    if (data.manualScore && data.scores) {
      setResults({
        variables: {
          matchId: ticket.match.id,
          matchGameResults: data.scores
            .filter((score) =>
              score?.results?.every((result) => result.score !== undefined)
            )
            .map((score) => ({
              matchGameId: score?.matchGameId ?? '',
              results: score?.results,
            })),
          ticketId: ticket.id,
          verdict: data.verdict,
        },
      })
    }

    setCurrentActive(false)
  }

  let ticketType = ''

  switch (ticket.type) {
    case TicketType.PlayerReport:
      ticketType = 'Player Report'
      break
    case TicketType.ScoreConflict:
      ticketType = 'Score Submission Issue'
      break
    case TicketType.GameIssue:
      ticketType = 'Technical Difficulties'
      break
    case TicketType.PlayerNotResponding:
      ticketType = 'Opponent Not Responding'
      break
    case TicketType.SiteIssue:
      ticketType = 'Site Issue'
      break
    default:
      ticketType = 'Other'
      break
  }

  return (
    <Modal
      active={currentActive}
      icon={<Icon variant="gear" />}
      titleElement={`Resolving Ticket - ${ticketType}`}
      className={styles.modal}
      width="45rem"
      onClose={() => {
        onClose?.()
        setCurrentActive(false)
      }}
    >
      <div className={styles.step}>
        <p className={styles.stepTitle}>1. Go to the discord support channel</p>
        <div className={styles.stepContent}>
          <div className={styles.supportWrapper}>
            <CopyToClipboard
              text={ticket.match?.supportLink ?? 'No Support Channel Set Up'}
              onCopy={(result) => result && setCopyCount(copyCount + 1)}
            >
              <div>
                <Tooltip
                  content={copy}
                  noHover={!ticket.match?.supportLink}
                  backgroundColor={styles.mattBlack}
                  className={classNames(styles.tooltip, {
                    [styles.overCopied]: copyCount > 7,
                  })}
                >
                  <div
                    className={styles.linkWrapper}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        setCopyCount(0)
                        setCopy('Click to copy!')
                      }, 200)
                    }}
                  >
                    <span className={styles.link}>
                      {ticket.match?.supportLink ?? 'No Support Channel Set Up'}
                    </span>
                    <Icon variant="copy" color={styles.steel} />
                  </div>
                </Tooltip>
              </div>
            </CopyToClipboard>

            <p className={styles.description}>
              Gather data (f.ex. screenshots) and choose who is in the right
            </p>
          </div>
        </div>
      </div>
      <div className={styles.step}>
        <p className={styles.stepTitle}>2. Review evidence and make verdict</p>
        <div className={styles.stepContent}>
          {ticket.type === TicketType.ScoreConflict ? (
            <ResolveScoreIssueForm
              ticket={ticket}
              onSubmit={(v) => handleScoreResolveSubmit(v, ticket)}
            />
          ) : (
            <ResolveTicketForm
              ticket={ticket}
              onSubmit={(v) => {
                handleResolveSubmit(v, ticket)
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
