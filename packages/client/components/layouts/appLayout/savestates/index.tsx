import React, { ReactElement } from 'react'
import styles from './savestates.module.scss'
import classNames from 'classnames'

export const Savestates: React.FC<{
  children: Array<ReactElement | undefined | null>
  className?: string
}> = ({ children, className }) => (
  <div className={classNames(styles.navigation, className)}>
    <div className={styles.itemList}>{children}</div>
  </div>
)

export const SaveNavItem: React.FC<{
  onClick: () => void
  icon?: React.ReactElement
  className?: string
}> = ({ icon, onClick, className }) => (
  <div className={classNames(styles.navItem, className)} onClick={onClick}>
    {icon}
  </div>
)
