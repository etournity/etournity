import React, { useState } from 'react'
import classNames from 'classnames'
import styles from './scoreInput.module.scss'

interface GameResult {
  matchGameId: string
  number: number
  results: Array<{
    teamId: string
    teamName?: string
    score: number | undefined
  }>
}

export interface ScoreInputProps {
  currentTeamId?: string
  values: GameResult[]
  onChange: (v: GameResult[], submitReady: boolean) => void
  disabled?: boolean
}

export const ScoreInput: React.FC<ScoreInputProps> = ({
  values,
  onChange,
  currentTeamId,
  disabled,
}) => {
  const winners = values
    .map(
      (game) =>
        [...game.results]
          .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
          .filter((result) => (result?.score ?? 0) > 0)?.[0]?.teamId
    )
    .filter((value) => value !== undefined)
  const [activeGame, setActiveGame] = useState(winners.length ?? 0)

  const minWinningScore = Math.ceil((values.length ?? 1) / 2)
  const filteredWins = countWins(winners)
  const matchesToShow =
    filteredWins?.length > 0
      ? minWinningScore +
        filteredWins.map((v, i) => (i > 0 ? v[1] : 0)).reduce((v, c) => v + c)
      : minWinningScore

  return (
    <div>
      {values.map((game, index) => {
        const leftResult = currentTeamId
          ? game.results.find((result) => result.teamId === currentTeamId)
          : game.results[0]
        const rightResult = currentTeamId
          ? game.results.find((result) => result.teamId !== currentTeamId)
          : game.results[1]

        const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          // Counters to determine current scores.
          let leftCounter = 0
          let rightCounter = 0
          const newValues = values.map((v) => {
            // Count up if respective team scored that game.
            if (game.number !== v.number) {
              leftCounter +=
                (currentTeamId
                  ? v.results.find((result) => result.teamId === currentTeamId)
                      ?.score
                  : v.results[0].score) ?? 0
              rightCounter +=
                (currentTeamId
                  ? v.results.find((result) => result.teamId !== currentTeamId)
                      ?.score
                  : v.results[1].score) ?? 0
            }

            if (game.number === v.number) {
              return {
                ...v,
                results: v.results.map((result, i) => {
                  // Count up for current game
                  leftCounter +=
                    i === 0 && result.teamId === e.currentTarget.value ? 1 : 0
                  rightCounter +=
                    i === 1 && result.teamId === e.currentTarget.value ? 1 : 0
                  // Set Active Game if current game is last game (to avoid being stuck on active)
                  if (i === 1) {
                    setActiveGame(leftCounter + rightCounter)
                  }

                  return {
                    ...result,
                    score: result.teamId === e.currentTarget.value ? 1 : 0,
                  }
                }),
              }
            }

            // Reset further Radios if one team has enough points (E.g: BO5 - 3-1 -> reset: Game 5)
            if (
              (leftCounter >= minWinningScore ||
                rightCounter >= minWinningScore) &&
              v.number >= leftCounter + rightCounter &&
              v.number > minWinningScore
            ) {
              const gameRadios = document.getElementsByName(
                `winner${v.number - 1}`
              ) as NodeListOf<HTMLInputElement>
              gameRadios.forEach((radio: HTMLInputElement) => {
                radio.checked = false
              })
              // Set Active Game after reset
              if (
                (leftCounter < minWinningScore ||
                  rightCounter < minWinningScore) &&
                rightCounter !== minWinningScore &&
                leftCounter !== minWinningScore
              ) {
                setActiveGame(leftCounter + rightCounter - 1)
              }

              return {
                ...v,
                results: v.results.map((result) => ({
                  ...result,
                  score: 0,
                })),
              }
            }

            setActiveGame(leftCounter + rightCounter)

            return v
          })
          const newWinners = newValues
            .map(
              (game) =>
                [...game.results]
                  .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
                  .filter((result) => (result?.score ?? 0) > 0)?.[0]?.teamId
            )
            .filter((value) => value !== undefined)

          onChange(
            newValues,
            (countWins(newWinners)[0]?.[1] ?? 0) >= minWinningScore
          )
        }

        return (
          <div
            key={`score${index}`}
            className={classNames(styles.radios, {
              [styles.active]: index === activeGame,
              [styles.hidden]: matchesToShow <= index,
              [styles.multiColor]: !currentTeamId,
            })}
          >
            <input
              id={`leftRadio${index}`}
              type="radio"
              name={`winner${index}`}
              disabled={disabled ?? activeGame < index}
              value={leftResult?.teamId}
              defaultChecked={(leftResult?.score ?? 0) > 0}
              onChange={onRadioChange}
            />
            <label
              className={classNames({ [styles.disabled]: disabled })}
              htmlFor={`leftRadio${index}`}
            >
              {currentTeamId ? 'You' : leftResult?.teamName}
            </label>
            <span className={styles.game}>Game {game.number}</span>
            <input
              id={`rightRadio${index}`}
              type="radio"
              name={`winner${index}`}
              disabled={disabled ?? activeGame < index}
              value={rightResult?.teamId}
              defaultChecked={(rightResult?.score ?? 0) > 0}
              onChange={onRadioChange}
            />
            <label
              className={classNames({ [styles.disabled]: disabled })}
              htmlFor={`rightRadio${index}`}
            >
              {currentTeamId ? 'Opponent' : rightResult?.teamName}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export function countWins(array: string[]) {
  const counts: Record<string, number> = {}
  array.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1
  })
  const sortable: Array<[string, number]> = []
  for (const val in counts) {
    if (Object.prototype.hasOwnProperty.call(counts, val))
      sortable.push([val, counts[val]])
  }

  return [...sortable]
    .sort(function (a, b) {
      return b[1] - a[1]
    })
    .filter((val) => val[0] !== '')
}
