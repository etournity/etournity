import React from 'react'
import classNames from 'classnames'
import styles from './step.module.scss'

export interface StepProps {
  name: string
  number?: number
  variant?: 'upcoming' | 'active' | 'done'
}

export const Step: React.FC<StepProps> = ({
  name,
  number,
  variant = 'upcoming',
}) => (
  <div className={classNames(styles.row, styles[variant])}>
    <p className={styles.text}>{name.toUpperCase()}</p>
    <div className={styles.numLineDiv}>
      <div className={styles.number}>{number}</div>
      <div className={styles.line} />
    </div>
  </div>
)
