import { Button } from '@components/ui/button'
import { Modal } from '@components/ui/modal'
import React, { useState } from 'react'
import {
  Participant,
  TicketType,
  useCreateTicketMutation,
  useGetPlayersFromTournamentQuery,
} from '@generated/graphql'
import styles from './ticketCreateForm.module.scss'
import { Loader } from '@components/ui/loader'
import { Empty } from '@components/ui/empty'
import { useAuth } from '@hooks/useAuth'
import { toast } from 'react-hot-toast'
import {
  FormValues,
  TicketCreateForm,
} from '@components/tournament/lobby/ticketCreation/ticketCreateForm'
import { Icon } from '@components/ui/icon'
import { DiscordLoginButton } from '@components/actions/discordLoginButton'
import { useGlobalReportContext } from '@state/globalReportModal'

export interface TicketCreateModalProps {
  onClose?: () => void
  onCreated?: () => void
  open: boolean
  tournamentId?: string
}

export const TicketCreateModal: React.FC<TicketCreateModalProps> = ({
  onClose,
  onCreated,
  open,
  tournamentId,
}) => {
  const user = useAuth()?.user
  const { error, loading, data } = useGetPlayersFromTournamentQuery({
    skip: !tournamentId || !user,
    variables: {
      tournamentId: tournamentId ?? '',
    },
  })
  const { resetForm } = useGlobalReportContext()

  const [createTicket] = useCreateTicketMutation()

  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>(
    'idle'
  )
  const onSubmit = ({ ticketType, player, description }: FormValues) => {
    setStatus('submitting')
    createTicket({
      variables: {
        reporterId: user?.id ?? '',
        ticketType: ticketType ?? TicketType.SiteIssue,
        reportedId: player?.id ?? '',
        tournamentId: tournamentId ?? '',
        message: description,
      },
    })
      .then((res) => {
        if (res?.data?.createTicket) {
          onCreated?.()
          resetForm()
          setStatus('submitted')
          setTimeout(() => {
            setStatus('idle')
            onClose?.()
          }, 1000)
        }
      })
      .catch((e) => {
        toast.error(e.message ?? 'An error occured!', { duration: 5000 })
      })
  }

  return (
    <Modal
      active={open}
      titleElement="REPORT A PROBLEM"
      icon={
        <img
          src="/assets/icons/flag.png"
          alt="red flag icon"
          height={24}
          width={24}
        />
      }
      onClose={onClose}
    >
      {user ? (
        status === 'submitting' || loading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : error ? (
          <div className={styles.emptyWrapper}>
            <Empty title="ERROR" description="TRY AGAIN LATER" />
          </div>
        ) : status === 'submitted' ? (
          <div className={styles.emptyWrapper}>
            <Empty
              icon={<Icon variant="tick" />}
              title="SUBMITTED"
              description=""
            />
          </div>
        ) : (
          <TicketCreateForm
            actions={
              <Button
                variant="secondary"
                onClick={() => {
                  onClose?.()
                  resetForm()
                }}
              >
                Cancel
              </Button>
            }
            players={(data?.tournament?.players ?? []) as Participant[]}
            onlyShowTypes={tournamentId ? null : [TicketType.SiteIssue]}
            onSubmit={onSubmit}
          />
        )
      ) : (
        <div className={styles.emptyWrapper}>
          <Empty
            icon={<Icon variant="closeCircle" size={4} />}
            title="Not Logged In"
            description="Please log in to report a problem"
            actions={<DiscordLoginButton />}
          />
        </div>
      )}
    </Modal>
  )
}
