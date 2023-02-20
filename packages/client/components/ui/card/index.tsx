import React, { ReactNode } from 'react'
import styles from './card.module.scss'
import classNames from 'classnames'
import tinycolor, { mostReadable } from 'tinycolor2'

export interface CardProps {
  title?: ReactNode
  children?: ReactNode
  className?: string
  disabled?: boolean
  insetTitle?: boolean
  borderRadius?: number
  headerColor?: string
}
export const Card: React.FC<CardProps> = ({
  title,
  children,
  insetTitle,
  borderRadius = 5,
  headerColor,
  className,
  disabled = false,
  ...rest
}) => {
  const headerTextColor = mostReadable(
    tinycolor(headerColor),
    [styles.white, styles.steel],
    {
      level: 'AAA',
    }
  ).toHexString()
  return (
    <div
      className={classNames(styles.card, className, {
        [styles.disabled]: disabled,
      })}
      style={{ borderRadius }}
      {...rest}
    >
      <div
        className={classNames(styles.title, {
          [styles.insetTitle]: insetTitle,
        })}
        style={
          insetTitle ? { background: headerColor, color: headerTextColor } : {}
        }
      >
        {title && typeof title === 'string' ? (
          <span className={styles.titleString}>{title}</span>
        ) : (
          title
        )}
      </div>
      <div className={styles.content}> {children}</div>
    </div>
  )
}
