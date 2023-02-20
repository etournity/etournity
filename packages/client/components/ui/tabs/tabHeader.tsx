import React, { useCallback, ReactNode } from 'react'
import styles from './tabHeader.module.scss'
import classNames from 'classnames'

export interface TabHeaderProps {
  header?: ReactNode
  index: number
  setSelectedTab: (index: number) => void
  selectedTab: number
  badge?: number
  className?: string
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  header,
  setSelectedTab,
  index,
  selectedTab,
  badge,
  className,
}) => {
  const onClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <div
      className={classNames(styles.header, className, {
        [styles.activeHeader]: selectedTab === index,
      })}
      onClick={onClick}
    >
      {typeof header === 'string' ? (
        <div className={styles.title}>
          <div>{header}</div>
          {badge !== undefined && (
            <div className={styles.badge}>
              |<div className={styles.badgeNumber}>{badge}</div>
            </div>
          )}
        </div>
      ) : (
        header
      )}
      <div
        className={classNames(styles.underline, {
          [styles.active]: selectedTab === index,
        })}
      />
    </div>
  )
}
