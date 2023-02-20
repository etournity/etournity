import { Icon } from '@components/ui/icon'
import { RoundStatus } from '@generated/graphql'
import classNames from 'classnames'
import React from 'react'
import styles from './roundStep.module.scss'

export interface RoundStepProps {
  number?: number
  status?: RoundStatus
  locked?: boolean
  id?: string
  matchesCount?: number
  matchesDone?: number
}

export const RoundStep: React.FC<RoundStepProps> = ({
  id,
  number = 1,
  status = RoundStatus.Upcoming,
  locked,
  matchesCount,
  matchesDone,
}) => (
  <div
    id={id}
    className={classNames(styles.roundStep, styles[status], {
      [styles.LOCKED]: locked,
    })}
  >
    <div className={styles.roundTitle}>Round</div>
    <div className={styles.number}>
      {number}
      {status === RoundStatus.Completed && (
        <div className={styles.tick}>
          <Icon variant="tick" color={styles.charcoal} size={0.4} />
        </div>
      )}
    </div>
    <div className={styles.lower}>
      {status !== RoundStatus.Completed && (
        <div>
          {matchesDone}/{matchesCount}
        </div>
      )}
      <div>Done</div>
    </div>
  </div>
)
