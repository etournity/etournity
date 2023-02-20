import {
  MatchStatus,
  Team,
  useChangeStatusMutation,
  useAddToInGameMutation,
} from '@generated/graphql'
import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps, LobbyPage } from '../..'
import styles from './compare.module.scss'
import { ScoreRow, teamDisplay } from '../../scoreRow'
import { Button } from '@components/ui/button'

export const Compare: React.FC<LobbyPageProps> = ({
  match,
  user,
  switchTo,
  currentTeam,
  opponentTeam,
}) => {
  const [changeStatus] = useChangeStatusMutation({
    onError: console.error,
  })
  const [addToInGame] = useAddToInGameMutation({ onError: console.error })
  const teamScoresForGame = (matchGameId: string, submissionTeam: Team) => {
    const results = match.matchGames.flatMap(
      (matchGame) =>
        matchGame.submissions.find(
          (submission) =>
            submission.matchGame?.id === matchGameId &&
            submission.teamId === submissionTeam?.id
        )?.results
    )
    return {
      current: results.find((result) => result?.teamId === currentTeam?.id)
        ?.score,
      opponent: results.find((result) => result?.teamId === opponentTeam?.id)
        ?.score,
    }
  }

  const scoreDiffForGame = (matchGameId: string, submissionTeam: Team) =>
    (teamScoresForGame(matchGameId, submissionTeam).current || 0) -
    (teamScoresForGame(matchGameId, submissionTeam).opponent || 0)

  const conflictingScores = match.matchGames.some(
    (matchGame) =>
      matchGame.status === 'CONFLICT' || matchGame.status === 'MANUAL_EDIT'
  )

  const manualEditRequired = match.matchGames.some(
    (matchGame) => matchGame.status === 'MANUAL_EDIT'
  )

  const sortedMatchGames = Array.from(match.matchGames).sort(
    (a, b) => a.number - b.number
  )

  const currentTeamResubmitted = match.matchGames.some(
    (matchGame) =>
      matchGame.submissions.find(
        (submission) => submission.teamId === currentTeam?.id
      )?.resubmitted === true
  )

  const conflictExplanation = currentTeamResubmitted
    ? manualEditRequired
      ? 'Scores have to be manually edited.'
      : 'Waiting for other team to resubmit scores.'
    : 'Both parties have submitted different scores.'
  return (
    <Dock
      showColoredTeamBorders
      showGameInfo
      user={user}
      match={match}
      phase="Post-Game-Phase"
      step={{ number: 4, info: 'Comparing Scores' }}
      disclaimer={{
        title: 'DISCLAIMER',
        content:
          'Please make an in-game screenshot of the score after every game.',
      }}
    >
      {!currentTeam || !opponentTeam ? (
        <div>Unable to fetch teams!</div>
      ) : (
        <div className={styles.wrapper}>
          {sortedMatchGames.map((matchGame) => {
            const gameWinner = {
              current:
                scoreDiffForGame(matchGame.id, currentTeam) > 0
                  ? currentTeam
                  : scoreDiffForGame(matchGame.id, currentTeam) === 0
                  ? undefined
                  : opponentTeam,
              opponent:
                scoreDiffForGame(matchGame.id, opponentTeam) > 0
                  ? currentTeam
                  : scoreDiffForGame(matchGame.id, opponentTeam) === 0
                  ? undefined
                  : opponentTeam,
            }
            const displayTeam = (team: Team): teamDisplay | undefined => {
              const { current, opponent } = gameWinner
              if (!current && !opponent) return undefined
              if (current?.id === team.id && opponent?.id === team.id)
                return { submission: 'both', label: 'Won' }
              if (current?.id === team.id)
                return { submission: 'current', label: 'Won' }
              if (opponent?.id === team.id)
                return { submission: 'opponent', label: 'Won' }
              return { submission: 'none', label: 'Lost' }
            }

            if (!displayTeam(currentTeam) && !displayTeam(opponentTeam))
              return null

            return (
              <ScoreRow
                key={matchGame.id}
                className={styles.row}
                type="display"
                gameNumber={matchGame.number}
                areScoresEqual={matchGame.submissionsEqual || false}
                currentDisplay={displayTeam(currentTeam)}
                opponentDisplay={displayTeam(opponentTeam)}
              />
            )
          })}

          {conflictingScores ? (
            <div className={styles.conflict}>
              <span className={styles.text}>{conflictExplanation}</span>
              {manualEditRequired ? (
                <Button
                  className={styles.button}
                  onClick={() => {
                    changeStatus({
                      variables: {
                        matchId: match.id,
                        status: MatchStatus.Error,
                      },
                    }).then(() => switchTo(LobbyPage.Resolve))
                  }}
                >
                  Resolve With Moderator
                </Button>
              ) : (
                <Button
                  disabled={currentTeamResubmitted}
                  className={styles.button}
                  onClick={() =>
                    addToInGame({ variables: { matchId: match.id } }).then(() =>
                      switchTo(LobbyPage.Scores)
                    )
                  }
                >
                  {currentTeamResubmitted
                    ? 'Already Resubmitted'
                    : 'Resubmit Scores'}
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.noConflict}>
              <Button
                className={styles.button}
                onClick={() => {
                  changeStatus({
                    variables: { matchId: match.id, status: MatchStatus.Done },
                  }).then(() => switchTo(LobbyPage.Results))
                }}
              >
                Show Match Summary
              </Button>
            </div>
          )}
        </div>
      )}
    </Dock>
  )
}
