import { Button } from '@components/ui/button'
import { ModalActions } from '@components/ui/modal'
import React, { ReactElement, useState } from 'react'
import { MatchStatus, Participant, TicketType, User } from '@generated/graphql'
import { Form, Formik } from 'formik'
import { Select } from '@components/ui/select'
import styles from './ticketCreateForm.module.scss'
import { TextArea } from '@components/ui/textarea'
import { Icon } from '@components/ui/icon'
import classNames from 'classnames'
import { createTicketSchema } from '@etournity/shared/validation'
import { PartialDeep } from 'type-fest'
import { useAuth } from '@hooks/useAuth'
import { useGlobalReportContext } from '@state/globalReportModal'
export interface TicketCreateFormProps {
  onSubmit?: (values: FormValues) => void
  /// Players that will show up in the player select
  players: Array<Participant | null>
  /// Components that will be added before the submit button
  actions?: ReactElement[] | ReactElement
  onlyShowTypes?: TicketType[] | null
}

export interface FormValues {
  ticketType: TicketType | null
  player: User | null
  description: string
}

export const TicketCreateForm: React.FC<TicketCreateFormProps> = ({
  onSubmit,
  players,
  actions,
  onlyShowTypes,
}) => {
  const { updateValues, store } = useGlobalReportContext()
  const user = useAuth()?.user

  const opponentTeam = user?.currentMatch?.opponents?.find(
    (team) => team.id !== user.currentParticipant?.team?.id
  )

  const initialValues: FormValues = store.values ?? {
    ticketType: null,
    player: null,
    description: '',
  }

  const [playerSelectOpen, setPlayerSelectOpen] = useState(
    initialValues.ticketType
      ? [TicketType.PlayerReport].includes(initialValues.ticketType)
      : false
  )

  return (
    <Formik<FormValues>
      enableReinitialize
      initialValues={initialValues}
      validationSchema={createTicketSchema.client}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(v) => onSubmit?.(v)}
    >
      {({
        handleSubmit,
        errors,
        getFieldProps,
        setFieldValue,
        values,
        dirty,
        setFieldTouched,
      }) => (
        <Form onSubmitCapture={handleSubmit}>
          <div className={styles.formWrapper}>
            <Select<TicketType>
              className={styles.select}
              placeholder="Type of Report"
              options={[
                { title: 'Game Issue', value: TicketType.GameIssue },
                {
                  title: 'Player Report',
                  value: TicketType.PlayerReport,
                },
                {
                  title: 'Opponent not responding',
                  value: TicketType.PlayerNotResponding,
                },
                { title: 'Site Issue', value: TicketType.SiteIssue },
              ].filter(
                (option) =>
                  (onlyShowTypes
                    ? onlyShowTypes?.includes(option.value)
                    : true) &&
                  ((user?.currentMatch?.opponents?.length ?? 0) > 1 &&
                  user?.currentMatch?.status !== MatchStatus.Started
                    ? true
                    : ![
                        TicketType.PlayerNotResponding,
                        TicketType.GameIssue,
                      ].includes(option.value))
              )}
              validate={() => errors.ticketType ?? null}
              {...getFieldProps('ticketType')}
              onChange={(change) => {
                setFieldValue('ticketType', change?.value)
                updateValues({
                  ...values,
                  ticketType: change?.value as TicketType,
                })
                if (
                  change?.value &&
                  (change.value === TicketType.PlayerReport ||
                    change.value === TicketType.GameIssue ||
                    change.value === TicketType.PlayerNotResponding)
                ) {
                  if (change.value !== TicketType.GameIssue) {
                    setPlayerSelectOpen(true)
                  }

                  const reportablePlayer =
                    players.find(
                      (player) => player?.team?.id === opponentTeam?.id
                    )?.user ??
                    null ??
                    null
                  setFieldValue('player', reportablePlayer)
                  updateValues({
                    ...values,
                    ticketType: change?.value as TicketType,
                    player: reportablePlayer,
                  })
                } else {
                  setPlayerSelectOpen(false)
                }
              }}
            />
            <Select<PartialDeep<User>>
              className={classNames(
                { [styles.hidden]: !playerSelectOpen },
                styles.select
              )}
              placeholder={
                values.ticketType === TicketType.PlayerNotResponding
                  ? 'Opponent'
                  : 'Player'
              }
              validate={() => errors.player ?? null}
              options={
                values.ticketType === TicketType.PlayerNotResponding &&
                opponentTeam
                  ? [
                      {
                        title: opponentTeam.name,
                        value:
                          players.find(
                            (player) => player?.team?.id === opponentTeam.id
                          )?.user?.id ?? '',
                        data: players.find(
                          (player) => player?.team?.id === opponentTeam.id
                        )?.user,
                      },
                    ]
                  : values.ticketType === TicketType.PlayerReport
                  ? players
                      ?.filter(
                        (player) => player?.id !== user?.currentParticipant?.id
                      )
                      ?.map((player) => ({
                        title: player?.user?.gameUsers?.[0]?.inGameName ?? '',
                        value: player?.user?.id ?? '',
                        data: player?.user,
                      }))
                  : []
              }
              {...getFieldProps('player')}
              value={getFieldProps('player')?.value?.id}
              onChange={(change) => {
                setFieldValue('player', change?.data)
                updateValues({
                  ...values,
                  player: (change?.data as User) ?? null,
                })
              }}
            />

            {values.ticketType && (
              <div className={styles.infoWrapper}>
                <div className={styles.info}>
                  <Icon
                    variant="info"
                    size={1}
                    className={styles.icon}
                    color={styles.middleGrey}
                  />
                  {values.ticketType === 'SITE_ISSUE' ? (
                    <div>
                      <p>
                        This ticket will be sent to the{' '}
                        <span className={styles.fabulousText}>
                          Etournity team
                        </span>
                        .
                      </p>
                    </div>
                  ) : (
                    <p>
                      This ticket will be sent to the{' '}
                      <span className={styles.fabulousText}>
                        tournament organizers
                      </span>
                      .
                    </p>
                  )}
                </div>
                {values.ticketType === 'SITE_ISSUE' && (
                  <p>
                    Also take a look at{' '}
                    <a
                      href="https://etournityspace.notion.site/Known-Issues-1d68aed52c224a5ab32e9064c11b7f65"
                      target="_blank"
                      rel="noreferrer noopener"
                      className={styles.knownIssues}
                    >
                      known issues
                    </a>
                    {' !'}
                  </p>
                )}
              </div>
            )}

            <TextArea
              id="description"
              placeholder="Description"
              validate={() => errors.description ?? null}
              {...getFieldProps('description')}
              onChange={(change) => {
                setFieldValue('description', change?.currentTarget.value)
                updateValues({
                  ...values,
                  description: change?.currentTarget.value ?? '',
                })
              }}
            />
          </div>
          <ModalActions>
            {actions}
            <Button type="submit">Send</Button>
          </ModalActions>
        </Form>
      )}
    </Formik>
  )
}
