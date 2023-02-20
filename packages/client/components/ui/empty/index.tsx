import React, { ReactNode } from 'react'
import styles from './empty.module.scss'
import { Icon } from '../icon/'

export interface EmptyProps {
  children?: ReactNode
  description?: string
  title?: string
  noTitle?: boolean
  icon?: ReactNode
  actions?: ReactNode | ReactNode[]
}

export const Empty: React.FC<EmptyProps> = ({
  children,
  description,
  title,
  noTitle,
  icon,
  actions,
}) => (
  <div className={styles.wrapper}>
    {icon ?? (
      <Icon
        variant="windCircle"
        rotate="right"
        size={5}
        color={styles.middleGrey}
      />
    )}
    {!noTitle && <p className={styles.title}>{title ?? 'NOTHING IN HERE'}</p>}
    <div className={styles.description}>
      {children ?? description ?? 'NOTHING IN HERE'}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </div>
)
