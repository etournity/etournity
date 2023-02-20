import React, { ReactElement, ReactNode } from 'react'
import { Icon } from '../icon'
import styles from './accessWrapper.module.scss'
import classnames from 'classnames'
import tinycolor from 'tinycolor2'

export interface AccessWrapperProps {
  children: ReactElement
  type?: 'hover' | 'static'
  hasAccess?: boolean
  title?: string
  message?: ReactNode
  backgroundOpacity?: number
  backgroundColor?: string
  className?: string
}

export const AccessWrapper: React.FC<AccessWrapperProps> = ({
  children,
  type = 'static',
  hasAccess = false,
  title = 'LOCKED',
  message,
  backgroundOpacity = 0.8,
  backgroundColor = styles.void,
  className,
}) => (
  <div
    className={classnames(styles.wrapper, className, styles[type], {
      [styles.hide]: hasAccess,
    })}
  >
    <children.type {...children.props} className={styles.component} />
    <div
      className={styles.accessDiv}
      style={{
        backgroundColor: tinycolor(backgroundColor)
          .setAlpha(backgroundOpacity)
          .toRgbString(),
        borderRadius: children.props?.style?.borderRadius,
      }}
    >
      <div className={styles.content}>
        <Icon variant="lock" size={3} />
        <span className={styles.title}>{title.toUpperCase()}</span>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  </div>
)
