import { HeaderItemProps, Table, TableItem } from '@components/ui/table'
import { Tab, Tabs } from '@components/ui/tabs'
import { Icon } from '@components/ui/icon'
import {
  Participant,
  ParticipantRoleType,
  Ticket,
  useSetAssigneeMutation,
  TicketType,
} from '@generated/graphql'
import { useAuth } from '@hooks/useAuth'
import React, { useState } from 'react'
import { PartialDeep } from 'type-fest'
import styles from './issueTracker.module.scss'
import { Button } from '@components/ui/button'
import { FloatingActionMenu } from '@components/ui/fam'
import { Avatar } from '@components/ui/avatar'
import { ResolveModal } from '@components/tournament/resolveModal'
import { Empty } from '@components/ui/empty'
import { Modal, ModalActions } from '@components/ui/modal'
import { toast } from 'react-hot-toast'

export interface IssueTrackerProps {
  loading: boolean
  tickets?: Ticket[]
  participants?: Array<PartialDeep<Participant>>
}
export const IssueTracker: React.FC<IssueTrackerProps> = ({
  tickets,
  loading,
  participants = [],
}) => {
  const user = useAuth()?.user
  const [resolve, setResolve] = useState<{
    open: boolean
    ticket?: Ticket
  }>({ open: false, ticket: undefined })

  const [setAssignee] = useSetAssigneeMutation({ onError: console.error })

  const ownTickets = tickets?.filter(
    (ticket) => ticket.assignee?.id === user?.id && !ticket.resolved
  )
  const assignedTickets = tickets?.filter(
    (ticket) =>
      ticket.assignee?.id !== undefined &&
      !ticket.resolved &&
      ticket.assignee?.id !== user?.id
  )
  const unassignedTickets = tickets?.filter(
    (ticket) => ticket.assignee?.id === undefined && !ticket.resolved
  )

  const closedTickets = tickets?.filter((ticket) => ticket.resolved === true)

  const ticketType = (type: TicketType | undefined) => {
    switch (type) {
      case TicketType.PlayerReport:
        return 'Player Report'
      case TicketType.ScoreConflict:
        return 'Score Submission Issue'
      case TicketType.GameIssue:
        return 'Technical Difficulties'
      case TicketType.PlayerNotResponding:
        return 'Opponent Not Responding'
      case TicketType.SiteIssue:
        return 'Site Issue'
      default:
        return 'Other'
    }
  }

  const renderTable = (data?: Ticket[], isClosed?: boolean) => {
    const tableHeaders: HeaderItemProps[] = [
      {
        key: 'id',
        label: 'ID',
        width: 5,
        sortable: true,
      },
      { key: 'type', label: 'Ticket Type', width: 15, sortable: true },
      {
        key: 'description',
        label: isClosed ? 'Verdict' : 'Description',
        width: 25,
      },
      {
        key: 'assignee',
        label: isClosed ? 'Resolved By' : 'Assignee',
        width: 10,
      },
    ]

    const isRelatedToTicket = (
      ticket: Ticket,
      participantUserId?: string
    ): boolean => {
      const isOpponent =
        ticket.match?.opponents.some(({ participants }) =>
          participants.some(({ userId }) => userId === participantUserId)
        ) ?? false
      const isReporter = ticket.reporter?.id === participantUserId ?? false
      const isReported = ticket.reported?.id === participantUserId ?? false

      return isOpponent || isReporter || isReported
    }

    const assignableStaff = (ticket: Ticket) =>
      participants?.filter(
        (participant) =>
          !isRelatedToTicket(ticket, participant.user?.id) &&
          participant.roles?.find(
            (role) =>
              role?.type === ParticipantRoleType.Moderator ||
              role?.type === ParticipantRoleType.Host ||
              role?.type === ParticipantRoleType.Admin
          )
      )

    const sorted = data
      ? [...data].sort((a, b) => (b?.number ?? 0) - (a?.number ?? 0))
      : []
    return (
      <Table
        headers={tableHeaders}
        loading={loading}
        maxHeight="29rem"
        emptyPlaceholder={
          <div className={styles.empty}>
            <Empty noTitle description="No tickets issued." />
          </div>
        }
      >
        {sorted.map((ticket) => (
          <TableItem
            key={ticket.id}
            className={styles.issue}
            itemData={{
              id: ticket.number,
              type: ticketType(ticket.type),
              description: isClosed
                ? ticket.verdict ?? 'No verdict'
                : ticket.message,
              assignee: (
                <span className={styles.assignee}>
                  {ticket.assignee ? (
                    ticket.assignee.id === user?.id ? (
                      'You'
                    ) : (
                      `${ticket.assignee?.linkedAccounts?.[0]?.username}#${ticket.assignee?.linkedAccounts?.[0]?.discriminator}`
                    )
                  ) : ticket.resolved ? (
                    'System'
                  ) : ticket.tournament?.hostUser?.id === user?.id ? (
                    (assignableStaff(ticket).length ?? 0) > 0 ? (
                      <FloatingActionMenu
                        placement="bottom"
                        activator={
                          <Button className={styles.assigneeButton}>
                            Choose Assignee
                          </Button>
                        }
                      >
                        {assignableStaff(ticket).map((participant) => (
                          <div
                            key={participant.id}
                            className={styles.user}
                            onClick={() => {
                              if (ticket.id && participant?.user?.id)
                                setAssignee({
                                  variables: {
                                    ticketId: ticket.id,
                                    assigneeId: participant.user.id,
                                  },
                                })
                            }}
                          >
                            <Avatar
                              userAccount={
                                participant?.user?.linkedAccounts?.[0]
                              }
                              size={1.25}
                            />
                            <span>{`${participant.user?.linkedAccounts?.[0]?.username}#${participant.user?.linkedAccounts?.[0]?.discriminator}`}</span>
                          </div>
                        ))}
                      </FloatingActionMenu>
                    ) : (
                      'No available Moderators'
                    )
                  ) : (
                    'No Assignee'
                  )}
                </span>
              ),
            }}
            seperatorColor={
              ticket.matchBlocked && !ticket.resolved
                ? styles.error
                : styles.darkGrey
            }
            borderColor={
              ticket.resolved
                ? styles.darkGrey
                : ticket.matchBlocked
                ? styles.error
                : styles.primary
            }
            leading={
              ticket.matchBlocked && !ticket.resolved ? (
                <div
                  style={{
                    background: styles.error,
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon variant="warn" color={styles.charcoal} />
                </div>
              ) : undefined
            }
            onClick={() =>
              (ticket.assignee || ticket.resolved) &&
              setResolve({ open: true, ticket })
            }
          />
        ))}
      </Table>
    )
  }

  return (
    <>
      <Tabs className={styles.tabs}>
        <Tab
          header={
            <div className={styles.header}>
              {ownTickets &&
                ownTickets.filter((ticket) => ticket.matchBlocked === true)
                  .length > 0 && (
                  <div className={styles.blocking}>
                    {
                      ownTickets.filter(
                        (ticket) => ticket.matchBlocked === true
                      ).length
                    }
                    {` Blocking`}
                  </div>
                )}

              <span className={styles.title}>
                My Tickets | {ownTickets?.length ?? 0}
              </span>
            </div>
          }
          className={styles.myTickets}
        >
          {renderTable(ownTickets)}
        </Tab>
        <Tab
          header={
            <div className={styles.header}>
              {assignedTickets &&
                assignedTickets.filter((ticket) => ticket.matchBlocked === true)
                  .length > 0 && (
                  <div className={styles.blocking}>
                    {
                      assignedTickets.filter(
                        (ticket) => ticket.matchBlocked === true
                      ).length
                    }
                    {` Blocking`}
                  </div>
                )}

              <span className={styles.title}>
                Assigned | {assignedTickets?.length ?? 0}
              </span>
            </div>
          }
        >
          {renderTable(assignedTickets)}
        </Tab>
        <Tab
          header={
            <div className={styles.header}>
              {unassignedTickets &&
                unassignedTickets.filter(
                  (ticket) => ticket.matchBlocked === true
                ).length > 0 && (
                  <div className={styles.blocking}>
                    {
                      unassignedTickets.filter(
                        (ticket) => ticket.matchBlocked === true
                      ).length
                    }
                    {` Blocking`}
                  </div>
                )}

              <span className={styles.title}>
                Unassigned | {unassignedTickets?.length ?? 0}
              </span>
            </div>
          }
        >
          {renderTable(unassignedTickets)}
        </Tab>
        <Tab
          header={
            <div className={styles.header}>
              <span className={styles.title}>
                Closed | {closedTickets?.length ?? 0}
              </span>
            </div>
          }
          className={styles.closed}
        >
          {renderTable(closedTickets, true)}
        </Tab>
      </Tabs>
      {resolve.ticket?.resolved ? (
        <Modal
          hideCloseButton
          active={resolve.open}
          titleElement="Verdict Information"
          className={styles.verdictModal}
          onClose={() => setResolve({ open: false })}
        >
          <div className={styles.verdictModalContent}>
            <p>
              {resolve.ticket.verdict ??
                'No verdict was submitted for this ticket.'}
            </p>
          </div>
          <ModalActions>
            <Button
              variant="tertiary"
              onClick={() => setResolve({ open: false })}
            >
              Ok
            </Button>
          </ModalActions>
        </Modal>
      ) : resolve.ticket ? (
        <ResolveModal
          ticket={resolve.ticket}
          active={resolve.open}
          onClose={() => setResolve({ open: false })}
          onError={(err) => toast.error(err.message)}
        />
      ) : null}
    </>
  )
}
