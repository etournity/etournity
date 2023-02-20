import { Icon } from '@components/ui/icon'
import classNames from 'classnames'
import React from 'react'
import styles from './roundAction.module.scss'

export interface RoundActionProps {
  status?: RoundActionVariant
  onChange: (variant: 'locked' | 'unlocked') => void
}

export enum RoundActionVariant {
  DONE = 'done',
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  ACTIVE = 'active',
  ACTIVELOCKED = 'activeLocked',
}

export const RoundAction: React.FC<RoundActionProps> = ({
  onChange,
  status = RoundActionVariant.UNLOCKED,
}) => (
  <div className={classNames(styles.roundAction, styles[status])}>
    <div className={styles.upperWrapper}>
      <div className={styles.lineLeft} />
      <div
        className={styles.circle}
        onClick={() =>
          status !== RoundActionVariant.DONE &&
          status !== RoundActionVariant.ACTIVE &&
          (status === RoundActionVariant.LOCKED ||
          status === RoundActionVariant.ACTIVELOCKED
            ? onChange('unlocked')
            : onChange('locked'))
        }
      >
        {status === RoundActionVariant.LOCKED ||
        status === RoundActionVariant.ACTIVELOCKED ? (
          <div className={styles.lock}>
            <Icon variant="lock" size={1} color={styles.error} />
          </div>
        ) : (
          <div className={styles.open}>
            <div className={styles.lineInCircle} />
            <Icon
              variant="chevron"
              size={0.875}
              color={
                status === RoundActionVariant.ACTIVE
                  ? styles.primary
                  : status === RoundActionVariant.DONE
                  ? styles.primarydisabled
                  : styles.middleGrey
              }
              className={styles.icon}
            />
          </div>
        )}
      </div>
      <div className={styles.lineRight} />
    </div>
    <div className={styles.text}>
      {status === RoundActionVariant.DONE
        ? ''
        : status === RoundActionVariant.LOCKED ||
          status === RoundActionVariant.ACTIVELOCKED
        ? 'locked'
        : 'unlocked'}
    </div>
  </div>
)
