import React from 'react'
import { Formik } from 'formik'
import { Radio } from '@components/ui/radio'
import { Ticket, Team, Match, Result, Submission } from '@generated/graphql'
import { PartialDeep } from 'type-fest'
import { Button } from '@components/ui/button'
import { ModalActions } from '@components/ui/modal'
import styles from './resolveScoreIssue.module.scss'
import className from 'classnames'

export interface ScoreIssueFormValues {
  winner: string | undefined
  manualScore: boolean
  verdict: string | undefined
  scores: Array<
    | {
        matchGameId: string
        results: Result[] | undefined
      }
    | undefined
  >
}
export const ResolveScoreIssueForm: React.FC<{
  ticket: Ticket
  onSubmit: (values: ScoreIssueFormValues) => void
}> = ({ ticket, onSubmit }) => {
  if (!ticket.match) return <span>No match found</span>

  const initialValues: ScoreIssueFormValues = {
    winner: undefined,
    manualScore: false,
    verdict: undefined,
    scores: [],
  }

  return (
    <Formik initialValues={initialValues} onSubmit={(v) => onSubmit(v)}>
      {({ dirty, setFieldValue, values, handleSubmit }) => (
        <div className={styles.formWrapper}>
          <div
            className={className(styles.submissionWrapper, {
              [styles.collapsed]: values.manualScore,
            })}
          >
            {ticket.match?.opponents?.map((team, index: number) => [
              <div
                key={team?.id}
                className={className(styles.submission, {
                  [styles.selected]: values.winner === team?.id,
                })}
                onClick={() => {
                  setFieldValue('winner', team?.id)
                  setFieldValue(
                    'verdict',
                    `Winner set by staff. ${team?.name} won.`
                  )
                  setFieldValue('manualScore', false)
                }}
              >
                <Radio
                  readOnly
                  name="winner"
                  value={team?.id}
                  className={styles.submitter}
                  checked={values.winner === team?.id}
                  label={
                    <div>
                      SUBMITTED BY <p>{team?.name}</p>
                    </div>
                  }
                />
                <TeamResults team={team} match={ticket.match ?? undefined} />
              </div>,
              index + 1 < (ticket.match?.opponents?.length ?? 0) && (
                <div className={styles.divider} />
              ),
            ])}
          </div>
          {/* Disabled for now, since it's prone to issues and very unlikely to benefit the organizers. */}
          {/* <div className={styles.checkbox}>
            <Checkbox
              name="manualScore"
              onClick={() => {
                setFieldValue('manualScore', !values.manualScore)
                setFieldValue('winner', undefined)
              }}
            />
            <div>
              <p>Both parties have submitted wrong scores</p>
              <p>(this will give you the chance to submit the right scores)</p>
            </div>
          </div>
          <div
            className={className(styles.inputWrapper, {
              [styles.collapsed]: !values.manualScore,
            })}
          >
            <div className={styles.teamNames}>
              {ticket.match?.opponents?.map((opponent) => (
                <span key={opponent?.id}>{opponent?.name}</span>
              ))}
            </div>
            <ScoreInput
              values={
                ticket.match?.matchGames?.map((matchGame) => ({
                  matchGameId: matchGame?.id ?? '',
                  number: matchGame?.number ?? 0,
                  results:
                    ticket.match?.opponents?.map((team) => ({
                      teamId: team?.id ?? '',
                      teamName: team?.name,
                      score: values.scores
                        ?.find((score) => score?.matchGameId === matchGame?.id)
                        ?.results?.find((result) => result.teamId === team?.id)
                        ?.score,
                    })) ?? [],
                })) ?? []
              }
              onChange={(v, submitReady) => {
                const newValues = v.map((value) => ({
                  matchGameId: value.matchGameId,
                  results: value.results.map((result) => ({
                    teamId: result.teamId,
                    score: result.score,
                  })),
                }))
                setFieldValue('scores', newValues)
                setScoresSubmittable(submitReady)
              }}
            />
          </div> */}
          <div className={styles.actionWrapper}>
            <ModalActions className={styles.actions}>
              <Button
                type="submit"
                disabled={!dirty || (!values.manualScore && !values.winner)}
                onClick={() => {
                  if (values.manualScore)
                    setFieldValue('verdict', 'Score manually set by staff.')
                  handleSubmit()
                }}
              >
                Resolve Issue
              </Button>
            </ModalActions>
          </div>
        </div>
      )}
    </Formik>
  )
}

const TeamResults: React.FC<{
  team: PartialDeep<Team> | undefined
  match?: PartialDeep<Match>
}> = ({ team, match }) => {
  // Submissions of the specified team (filters out games without scores)
  const teamSubmissions = match?.matchGames
    ?.map((matchGame) =>
      matchGame?.submissions?.find(
        (submission) =>
          submission?.teamId === team?.id &&
          !submission?.results?.every((result) => result?.score === 0)
      )
    )
    .filter((submission) => submission !== undefined)
  const opponents = match?.opponents

  const isWinner = (
    teamSubmission: PartialDeep<Submission> | undefined,
    teamId: string | undefined
  ) =>
    (teamSubmission?.results?.find((result) => result?.teamId === teamId)
      ?.score ?? 0) >
    (teamSubmission?.results?.find(
      (result) =>
        result?.teamId === opponents?.find((team) => team?.id !== teamId)?.id
    )?.score ?? 0)

  return (
    <div className={styles.teamResult}>
      <div className={styles.teamNames}>
        {opponents?.map((opponent) => (
          <span key={opponent?.id}>{opponent?.name}</span>
        ))}
      </div>
      {teamSubmissions?.map((teamSubmission) => (
        <div key={teamSubmission?.id} className={styles.submissionRow}>
          <span
            className={className(styles.score, {
              [styles.isWinner]: isWinner(teamSubmission, opponents?.[0]?.id),
            })}
          >
            {teamSubmission?.teamId
              ? isWinner(teamSubmission, opponents?.[0]?.id)
                ? 'Won'
                : 'Lost'
              : 'N/A'}
          </span>
          <span className={styles.game}>
            Game {teamSubmission?.matchGame?.number}
          </span>
          <span
            className={className(styles.score, {
              [styles.isWinner]: isWinner(teamSubmission, opponents?.[1]?.id),
            })}
          >
            {teamSubmission?.teamId
              ? isWinner(teamSubmission, opponents?.[1]?.id)
                ? 'Won'
                : 'Lost'
              : 'N/A'}
          </span>
        </div>
      ))}
    </div>
  )
}
