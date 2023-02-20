import React from 'react'
import { Icon } from '../../../ui/icon'
import styles from './scoreRow.module.scss'
import classNames from 'classnames'

interface ScoreRowProps {
  type: 'input' | 'display'
  gameNumber: number
  areScoresEqual?: boolean
  currentDisplay?: teamDisplay
  opponentDisplay?: teamDisplay
  className?: string
}

export type teamDisplay = {
  submission: 'both' | 'current' | 'opponent' | 'none'
  label: string
}

export const ScoreRow: React.FC<ScoreRowProps> = ({
  type,
  gameNumber,
  areScoresEqual,
  currentDisplay,
  opponentDisplay,
  className,
}) => {
  if (type === 'display') {
    if (
      (currentDisplay?.submission === 'both' &&
        opponentDisplay?.submission !== 'none') ||
      (opponentDisplay?.submission === 'both' &&
        currentDisplay?.submission !== 'none')
    ) {
      console.error(
        "One display is already on 'both' status. A team can't have multiple submissions."
      )
    }
  }

  return (
    <div className={classNames(styles.row, className)}>
      <div>
        {type === 'display' && (
          <div
            className={classNames(
              styles.displayBorder,
              styles[currentDisplay?.submission ?? 'none']
            )}
          >
            <div className={styles.display}>
              {currentDisplay?.label ?? 'N/A'}
            </div>
          </div>
        )}
      </div>
      <div
        className={classNames(styles.game, {
          [styles.scoresEqual]: areScoresEqual,
        })}
      >
        <span>{`Game ${gameNumber}`}</span>
        {type === 'display' && (
          <Icon
            variant={areScoresEqual ? 'tickCircle' : 'closeCircle'}
            size={1}
            color={areScoresEqual ? styles.white : styles.error}
          />
        )}
      </div>
      <div>
        {type === 'display' && (
          <div
            className={classNames(
              styles.displayBorder,
              styles[opponentDisplay?.submission ?? 'none']
            )}
          >
            <div className={styles.display}>
              {opponentDisplay?.label ?? 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
