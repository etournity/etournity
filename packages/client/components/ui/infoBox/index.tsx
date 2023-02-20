import React, { ReactNode } from 'react'
import styles from './infoBox.module.scss'
import classNames from 'classnames'

export interface InfoBoxProps {
  children?: ReactNode
  title?: string
  className?: string
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  title,
  className,
}) => (
  <div className={classNames(styles.infobox, className)}>
    {title && <h1>{title}</h1>}
    {children}
  </div>
)
