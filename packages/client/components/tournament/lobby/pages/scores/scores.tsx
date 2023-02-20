import React from 'react'
import { LobbyPageProps } from '../../'
import { Dock } from '../../dock'
import { Form, Formik } from 'formik'
import {
  GameStatus,
  MatchInfoDocument,
  MatchInfoQuery,
  SubmissionCreateInput,
  useCreateSubmissionsMutation,
} from '@generated/graphql'
import { Button } from '@components/ui/button'
import styles from './scores.module.scss'
import classNames from 'classnames'
import { ScoreInput } from '../../scoreInput'
import { toast } from 'react-hot-toast'

export const Scores: React.FC<LobbyPageProps> = ({
  match,
  user,
  currentTeam,
  opponentTeam,
  creatorTeam,
  guestTeam,
}) => {
  const [createSubmissions, data] = useCreateSubmissionsMutation({
    onError: (err) => {
      console.error(err.message)
      toast.error("Couldn't create Submission")
    },
    update: (cache, { data: submissionsData }) => {
      const submissions = submissionsData?.createSubmissions
      cache.updateQuery<MatchInfoQuery>(
        {
          query: MatchInfoDocument,
          variables: { matchId: match.id },
          broadcast: false,
        },
        () => {
          if (!match) return null
          const allSubmitted = (teamId: string) => {
            const prevSubmissions = match.matchGames.flatMap((matchGame) =>
              matchGame.submissions.filter(
                (submission) => submission.teamId === teamId
              )
            )
            const teamSubmissions =
              prevSubmissions.length > 0
                ? prevSubmissions.filter(
                    (submission) => submission.teamId === teamId
                  )
                : submissions?.filter(
                    (submission) => submission?.teamId === teamId
                  )

            return teamSubmissions?.length === match.round?.format
          }

          return {
            match: {
              ...match,
              inGame: submissions?.[0]?.matchGame?.match.inGame ?? match.inGame,
              opponents: match.opponents.map((opponent) => ({
                ...opponent,
                allScoresSubmitted: allSubmitted(opponent.id),
              })),
              matchGames: match.matchGames.map((game) => {
                const teamHasSubmissions = game.submissions.some(
                  (submission) => submission.teamId === currentTeam?.id
                )
                const gameSubmission = submissions?.find(
                  (submission) => submission?.matchGame?.id === game.id
                )
                return {
                  ...game,
                  status: gameSubmission?.matchGame?.status ?? game.status,
                  submissionsEqual:
                    gameSubmission?.matchGame?.submissionsEqual ??
                    game.submissionsEqual,
                  finalResults:
                    gameSubmission?.matchGame?.finalResults ??
                    game.finalResults,
                  submissions: teamHasSubmissions
                    ? game.submissions.map((oldSubmission) =>
                        oldSubmission.id === gameSubmission?.id
                          ? gameSubmission
                          : oldSubmission
                      )
                    : gameSubmission
                    ? [...game.submissions, gameSubmission]
                    : [],
                }
              }),
            },
          }
        }
      )
    },
  })

  const gamesInConflict = match.matchGames.some(({ status }) =>
    [GameStatus.Conflict, GameStatus.ManualEdit].includes(status)
  )

  const currentSubmissionsComplete =
    match.matchGames.flatMap(({ submissions }) =>
      submissions.filter(
        ({ resubmitted, teamId }) =>
          currentTeam?.id === teamId && gamesInConflict === resubmitted
      )
    ).length === match.matchGames.length

  const opponentSubmissionComplete =
    match.matchGames.flatMap(({ submissions }) =>
      submissions.filter(
        ({ resubmitted, teamId }) =>
          opponentTeam?.id === teamId && gamesInConflict === resubmitted
      )
    ).length === match.matchGames.length

  const initialValues: {
    submissionInputs: SubmissionCreateInput[]
    winners: string[]
  } = {
    submissionInputs: match.matchGames.map((matchGame) => {
      const teamSubmission = matchGame.submissions.find(
        ({ teamId, resubmitted }) =>
          teamId === currentTeam?.id && gamesInConflict === resubmitted
      )

      return {
        matchGameId: matchGame.id,
        number: matchGame.number,
        teamId: teamSubmission?.teamId ?? '',
        results:
          teamSubmission?.results ??
          match.opponents.map((team) => ({ teamId: team.id ?? '', score: 0 })),
      }
    }),
    winners: match.matchGames.map(
      (matchGame) =>
        matchGame.submissions
          .find(
            ({ teamId, resubmitted }) =>
              teamId === currentTeam?.id && gamesInConflict === resubmitted
          )
          ?.results.find((result) => result.score > 0)?.teamId ?? ''
    ),
  }

  const [submitReady, setSubmitReady] = React.useState(
    initialValues.winners.filter((string) => string.length > 0).length >=
      Math.ceil(match.matchGames.length / 2)
  )

  const handleSubmission = async (matchInputs: {
    submissionInputs: SubmissionCreateInput[]
    winners: string[]
  }) => {
    await createSubmissions({
      variables: {
        data: matchInputs.submissionInputs.map((gameInputs) => ({
          matchGameId: gameInputs.matchGameId || '',
          number: gameInputs.number,
          teamId: currentTeam?.id || '',
          results: gameInputs.results,
        })),
      },
    })
  }

  return (
    <Dock
      showGameInfo
      match={match}
      user={user}
      phase="Post-Game-Phase"
      step={{
        number: 3,
        info: 'Submit Scores',
      }}
      disclaimer={{
        title: 'DISCLAIMER',
        content:
          'Please make an in-game screenshot of the score after every game.',
      }}
      tooltip={{
        title: 'Submitting Scores',
        width: 18,
        content: (
          <div>
            <p>Please declare the winner of each game.</p>
            <br />
            <p>
              For each game, click on &quot;You&quot; if you&apos;ve won the
              game or on &quot;Opponent&quot; if you&apos;ve lost.
            </p>
            <br />
            <p>
              Your inputs will be compared to those of your opponent afterwards.
            </p>
          </div>
        ),
      }}
      creator={{
        description: creatorTeam?.allScoresSubmitted
          ? 'Submitted scores'
          : 'Submitting scores',
        icon: {
          variant: creatorTeam?.allScoresSubmitted
            ? 'scoreFilled'
            : 'scoreHollow',
        },
        progress: creatorTeam?.allScoresSubmitted ? 'done' : 'waiting',
      }}
      guest={{
        description: guestTeam?.allScoresSubmitted
          ? 'Submitted scores'
          : 'Submitting scores',
        icon: {
          variant: guestTeam?.allScoresSubmitted
            ? 'scoreFilled'
            : 'scoreHollow',
        },
        progress: guestTeam?.allScoresSubmitted ? 'done' : 'waiting',
      }}
    >
      {currentTeam?.leaderId === user.currentParticipant?.id ? (
        <Formik initialValues={initialValues} onSubmit={handleSubmission}>
          {({ values, setFieldValue }) => {
            const minWinningScore = Math.ceil((match?.round?.format || 1) / 2)
            const filteredWins = countWins(values.winners)
            const matchesToShow =
              filteredWins?.length > 0
                ? minWinningScore +
                  filteredWins
                    .map((v, i) => (i > 0 ? v[1] : 0))
                    .reduce((v, c) => v + c)
                : minWinningScore
            const winsToShow = countWins(
              values.winners.filter((_, i) => i < matchesToShow)
            )
            return (
              <Form className={styles.formWrapper}>
                <span
                  className={styles.bestOf}
                >{`Best of ${match.round?.format}`}</span>
                <div className={styles.bubbles}>
                  {Array(match?.round?.format ?? 3)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={`bubble${i}`}
                        className={classNames(styles.bubble, {
                          [styles.win]:
                            i === Math.floor((match?.round?.format ?? 3) / 2),
                          [styles.pointLeft]:
                            i <
                            (winsToShow?.find(
                              (win) => win[0] === currentTeam?.id
                            )?.[1] ?? 0),
                          [styles.pointRight]:
                            i >
                            Math.floor(match.round?.format || 3) -
                              (winsToShow?.find(
                                (win) => win[0] === opponentTeam?.id
                              )?.[1] ?? 0) -
                              1,
                        })}
                      />
                    ))}
                </div>
                <ScoreInput
                  currentTeamId={currentTeam?.id}
                  disabled={currentSubmissionsComplete}
                  values={match.matchGames.map((matchGame) => ({
                    matchGameId: matchGame.id,
                    number: matchGame.number,
                    results:
                      values.submissionInputs.find(
                        (submission) => submission.matchGameId === matchGame.id
                      )?.results ?? [],
                  }))}
                  onChange={(value, submitReady) => {
                    setSubmitReady(submitReady)
                    const newValues = value.map((value) => ({
                      matchGameId: value.matchGameId,
                      results: value.results.map((result) => ({
                        teamId: result.teamId,
                        score: result.score ?? 0,
                      })),
                    }))
                    const newWinners = value.map(
                      (value) =>
                        value.results?.find((result) => (result.score ?? 0) > 0)
                          ?.teamId
                    )
                    setFieldValue('winners', newWinners)
                    setFieldValue('submissionInputs', newValues)
                  }}
                />
                {submitReady ? (
                  <Button
                    type={
                      data.data || currentSubmissionsComplete
                        ? 'button'
                        : 'submit'
                    }
                    loading={
                      data.data
                        ? !opponentSubmissionComplete
                        : currentSubmissionsComplete ?? false
                    }
                  >
                    {data.data || currentSubmissionsComplete
                      ? 'Waiting for opponent to submit scores.'
                      : 'Submit'}
                  </Button>
                ) : null}
              </Form>
            )
          }}
        </Formik>
      ) : (
        <div>
          <span>Wait for your Teamleader to submit your scores.</span>
        </div>
      )}
    </Dock>
  )
}

function countWins(array: string[]) {
  const counts: Record<string, number> = {}
  array.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1
  })

  const sortable: Array<[string, number]> = []
  for (const val in counts) {
    if (Object.prototype.hasOwnProperty.call(counts, val))
      sortable.push([val, counts[val]])
  }

  return sortable
    .sort(function (a, b) {
      return b[1] - a[1]
    })
    .filter((val) => val[0] !== '')
}
