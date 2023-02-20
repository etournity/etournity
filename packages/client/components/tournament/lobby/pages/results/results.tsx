import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps } from './../../'
import Link from 'next/link'
import { Button } from '@components/ui/button'
import styles from './results.module.scss'
import classNames from 'classnames'
import { MatchGame } from '@generated/graphql'
import { Icon } from '@components/ui/icon'
import { Empty } from '@components/ui/empty'

export const Results: React.FC<LobbyPageProps> = ({
  match,
  user,
  isInMatch,
  currentTeam,
  opponentTeam,
  creatorTeam,
}) => {
  const finalTeamScores = (teamId: string | undefined) => {
    if ((match.matchGames.length ?? 0) < 1) return 0
    return match.matchGames
      .map(
        (matchGame) =>
          matchGame.finalResults?.find((result) => result?.teamId === teamId)
            ?.score ?? 0
      )
      .reduce((acc: number, score: number) => acc + score)
  }

  const currentTeamWon = (matchGame: MatchGame) =>
    [...(matchGame.finalResults ?? [])]?.sort(
      (a, b) => (b?.score ?? 0) - (a?.score ?? 0)
    )[0]?.teamId === currentTeam?.id

  const winnerTeam =
    finalTeamScores(currentTeam?.id) > finalTeamScores(opponentTeam?.id)
      ? currentTeam
      : opponentTeam

  const youWon = winnerTeam?.id === currentTeam?.id

  const isDraw =
    finalTeamScores(currentTeam?.id) === finalTeamScores(opponentTeam?.id)

  const bothNoShow = match.readyChecks.length === 0

  const creatorTeamWon = winnerTeam?.id === creatorTeam?.id
  // Filter matchGames with no scores (not played)
  const filteredMatchGames = match.matchGames?.filter(
    (matchGame) =>
      !matchGame?.finalResults?.every((result) => result?.score === 0)
  )

  return (
    <Dock
      user={user}
      match={match}
      phase="Summary"
      creator={{
        description: isDraw ? 'Draw' : creatorTeamWon ? 'Won' : 'Lost',
        icon: {
          variant: isDraw ? 'warn' : creatorTeamWon ? 'tick' : 'close',
        },
        progress: 'done',
      }}
      guest={{
        description: isDraw ? 'Draw' : creatorTeamWon ? 'Lost' : 'Won',
        icon: {
          variant: isDraw ? 'warn' : creatorTeamWon ? 'close' : 'tick',
        },
        progress: 'done',
      }}
    >
      {!currentTeam || !opponentTeam ? (
        <Empty icon={<Icon variant="closeCircle" />}>
          Unable to fetch teams!
        </Empty>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.overview}>
            <div
              className={classNames(styles.scoreBorder, {
                [styles.highlight]: youWon,
              })}
            >
              <span className={styles.score}>
                {finalTeamScores(currentTeam.id)}
              </span>
            </div>
            <span
              className={classNames(styles.winner, {
                [styles.highlightText]: youWon,
              })}
            >
              {isDraw
                ? 'Draw'
                : isInMatch
                ? youWon
                  ? 'You Won'
                  : 'You Lost'
                : `${winnerTeam?.name} Won`}
            </span>
            <div
              className={classNames(styles.scoreBorder, {
                [styles.highlight]: !youWon,
              })}
            >
              <span className={styles.score}>
                {finalTeamScores(opponentTeam.id)}
              </span>
            </div>
          </div>

          <div>
            {filteredMatchGames.map((matchGame) => (
              <div key={matchGame.id} className={styles.game}>
                <div
                  className={classNames(styles.indicatorBorder, {
                    [styles.highlight]: currentTeamWon(matchGame),
                  })}
                >
                  <div className={styles.indicator}>
                    {currentTeamWon(matchGame) ? 'Won' : 'Lost'}
                  </div>
                </div>
                <span>Game {matchGame.number}</span>
                <div
                  className={classNames(styles.indicatorBorder, {
                    [styles.highlight]: !currentTeamWon(matchGame),
                  })}
                >
                  <div className={styles.indicator}>
                    {currentTeamWon(matchGame) ? 'Lost' : 'Won'}
                  </div>
                </div>
              </div>
            ))}
            {filteredMatchGames.length === 0 && (
              <p className={styles.description}>
                {bothNoShow
                  ? 'Both teams failed the ready-check. This match counts as a draw and both teams are disqualified.'
                  : 'No Results found. If this is unexpected, please open a ticket.'}
              </p>
            )}
          </div>
          <div className={styles.divider} />
          <div className={styles.info}>
            <Icon className={styles.icon} variant="info" color={styles.white} />
            Next Round starts after all other teams are done playing.
          </div>
          <Link
            passHref
            href={`/tournament/${match.round?.stage?.tournament?.id}/`}
          >
            <Button className={styles.button} variant="secondary">
              Return to brackets
            </Button>
          </Link>
        </div>
      )}
    </Dock>
  )
}
