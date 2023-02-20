import React from 'react'
import { Icon } from '@components/ui/icon'
import classNames from 'classnames'
import styles from './table.module.scss'

export interface HeaderItemProps {
  label: string
  key: string
  width?: number
  sortable?: boolean
  hasLeading?: boolean
  onSort?: (order: 'ASC' | 'DESC' | 'NONE') => void
  currentOrder?: 'ASC' | 'DESC' | 'NONE'
}

export const HeaderItem: React.FC<HeaderItemProps> = ({
  key,
  label,
  width,
  sortable,
  hasLeading,
  onSort,
  currentOrder,
}) => (
  <div
    key={key}
    className={classNames(styles.headerItem, {
      [styles.sortable]: sortable,
      [styles.sorted]: currentOrder === 'ASC' || currentOrder === 'DESC',
      [styles.hasLeading]: hasLeading,
    })}
    style={{ width: `${width ?? 5}rem` }}
    onClick={() => {
      if (sortable && onSort) {
        onSort(currentOrder ?? 'NONE')
      }
    }}
  >
    {label}
    <Icon
      variant="chevron"
      size={0.75}
      color={styles.primary}
      rotate={
        currentOrder === 'ASC' ? 'up' : currentOrder === 'DESC' ? 'down' : 'up'
      }
    />
  </div>
)
