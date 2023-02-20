import React, { ReactElement } from 'react'
import { Ticket, TicketType } from '@generated/graphql'
import { RadioGroup, Radio } from '@components/ui/radio'
import { Form, Formik } from 'formik'
import { resolveTicketSchema } from '@etournity/shared/validation/models/tickets'
import { TextArea } from '@components/ui/textarea'
import { Card } from '@components/ui/card'
import { PartialDeep } from 'type-fest'
import styles from './resolveTicket.module.scss'
import { Icon } from '@components/ui/icon'
import { ModalActions } from '@components/ui/modal'
import { Button } from '@components/ui/button'
export interface ResolveFormValues {
  action?: Actions
  target?: string
  verdict?: string
}
export enum Actions {
  DISMISS = 'dismiss',
  RESET = 'reset',
  WARNING = 'warning',
  KICK = 'kick',
  WINNER = 'winner',
}
export interface ResolveTicketFormProps {
  onSubmit: (value: ResolveFormValues) => void
  ticket: PartialDeep<Ticket>
  /// Components that will be added in front of the submit button
  actions?: ReactElement[] | ReactElement
}
export const ResolveTicketForm: React.FC<ResolveTicketFormProps> = ({
  ticket,
  onSubmit,
  actions,
}) => {
  const reporterName = `${ticket.reporter?.linkedAccounts?.[0]?.username}#${ticket.reporter?.linkedAccounts?.[0]?.discriminator}`

  const reportedName = `${ticket.reported?.linkedAccounts?.[0]?.username}#${ticket.reported?.linkedAccounts?.[0]?.discriminator}`

  const getTeam = (userId: string | undefined) =>
    ticket.match?.opponents?.find((team) =>
      team?.participants?.some((participant) => participant?.userId === userId)
    )

  const initialValues: ResolveFormValues = {
    target: undefined,
    action: undefined,
    verdict: undefined,
  }

  const getTarget = (action: Actions, type?: TicketType) => {
    if (type === TicketType.PlayerReport) {
      if (action === Actions.KICK || action === Actions.WARNING) {
        return ticket.reported?.id
      }
    }

    if (type === TicketType.PlayerNotResponding) {
      if (action === Actions.KICK) {
        return ticket.reported?.id
      }

      if (action === Actions.WINNER) {
        return getTeam(ticket.reporter?.id)?.id
      }
    }

    if (type === TicketType.GameIssue || type === TicketType.SiteIssue) {
      if (action === Actions.RESET) {
        return ticket.match?.id
      }
    }

    return 'none'
  }

  return (
    <div className={styles.wrapper}>
      {ticket.type === TicketType.PlayerReport && (
        <span className={styles.reporterToReported}>
          <span className={styles.reporterTeam}>{reporterName}</span>
          <Icon variant="chevron" size={0.75} rotate="right" />
          <span className={styles.reportedTeam}>{reportedName}</span>
        </span>
      )}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={resolveTicketSchema.client}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(v, { resetForm }) => {
          onSubmit?.(v)
          resetForm({ values: initialValues })
        }}
      >
        {({
          handleSubmit,
          errors,
          getFieldProps,
          setFieldValue,
          values,
          dirty,
        }) => (
          <Form onSubmitCapture={handleSubmit}>
            <div className={styles.inputWrapper}>
              <Card
                title={
                  <span className={styles.msgTitle}>
                    <span className={styles.reporter}>{reporterName}</span>
                    {` wrote`}
                  </span>
                }
                className={styles.card}
              >
                <div>{ticket.message}</div>
              </Card>
              <Card title="Quick Actions" className={styles.card}>
                <RadioGroup
                  name="actions"
                  onChecked={(value) => {
                    setFieldValue('action', value.value)
                    if (value.child?.value) {
                      setFieldValue('target', value.child?.value)
                    } else {
                      setFieldValue(
                        'target',
                        getTarget(value.value as Actions, ticket.type)
                      )
                    }
                  }}
                >
                  <Radio
                    key="dismiss"
                    label="Dismiss issue"
                    value={Actions.DISMISS}
                  />

                  {ticket.type === TicketType.PlayerReport ? (
                    <Radio
                      key="kickPlayer"
                      label={
                        <span>
                          Kick
                          <span className={styles.reportedTeam}>
                            {` ${reportedName} `}
                          </span>
                          from Tournament
                        </span>
                      }
                      value={Actions.KICK}
                    />
                  ) : null}
                  {ticket.type === TicketType.PlayerNotResponding ? (
                    <Radio
                      key="kickTeam"
                      label={
                        <span>
                          Kick{' '}
                          <span className={styles.reportedTeam}>
                            {getTeam(ticket.reported?.id)?.name}
                          </span>{' '}
                          from Tournament
                        </span>
                      }
                      value={Actions.KICK}
                    />
                  ) : null}
                  {ticket.type === TicketType.PlayerNotResponding ? (
                    <Radio
                      key="reporterWins"
                      label={
                        <span>
                          Give{' '}
                          <span className={styles.reporterTeam}>
                            {getTeam(ticket.reporter?.id)?.name}
                          </span>{' '}
                          match victory
                        </span>
                      }
                      value={Actions.WINNER}
                    />
                  ) : null}
                  {(ticket.type === TicketType.GameIssue ||
                    ticket.type === TicketType.SiteIssue) &&
                  ticket.match ? (
                    <Radio
                      key="reset"
                      label="Reset Match"
                      value={Actions.RESET}
                    />
                  ) : null}
                  {(ticket.type === TicketType.GameIssue ||
                    ticket.type === TicketType.SiteIssue) &&
                  ticket.match &&
                  ticket.reporter &&
                  ticket.reported ? (
                    <Radio
                      key="winner"
                      label="Choose winner of match"
                      value={Actions.WINNER}
                    >
                      <Radio
                        label={
                          <span className={styles.reporterTeam}>
                            {getTeam(ticket.reporter.id)?.name}
                          </span>
                        }
                        value={getTeam(ticket.reporter.id)?.id}
                      />

                      <Radio
                        label={
                          <span className={styles.reportedTeam}>
                            {getTeam(ticket.reported.id)?.name}
                          </span>
                        }
                        value={getTeam(ticket.reported.id)?.id}
                      />
                    </Radio>
                  ) : null}
                </RadioGroup>
              </Card>
            </div>
            {values.action && values.action !== Actions.DISMISS && ticket.type && (
              <Card className={styles.verdictCard}>
                <div>
                  <span className={styles.description}>
                    (Optional) Explanation of your verdict
                  </span>
                  <TextArea
                    id="verdict"
                    placeholder="Write your explanation..."
                    validate={() => errors.verdict ?? null}
                    {...getFieldProps('verdict')}
                  />
                </div>
              </Card>
            )}
            <div className={styles.actionWrapper}>
              <ModalActions className={styles.actions}>
                {actions}
                <Button type="submit" disabled={!dirty}>
                  Resolve Issue
                </Button>
              </ModalActions>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
