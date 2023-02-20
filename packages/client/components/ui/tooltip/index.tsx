import React, { ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './tooltip.module.scss'
import Tinycolor, { mostReadable } from 'tinycolor2'

export interface TooltipProps {
  content: ReactNode
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  children: ReactElement
  backgroundColor?: string
  className?: string
  noHover?: boolean
  width?: number
  disabled?: boolean
}
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  placement = 'top',
  children,
  backgroundColor = styles.ashBlack,
  className,
  noHover,
  width,
  disabled,
}) => {
  const textColor = mostReadable(
    new Tinycolor(backgroundColor),
    [styles.white, styles.steel],
    {
      level: 'AAA',
    }
  ).toHexString()

  return (
    <div className={classNames(styles.wrapper, className)}>
      <children.type
        {...children.props}
        className={classNames(styles.activator, children.props.className)}
      />

      <div
        style={{ backgroundColor, color: textColor, width: `${width}rem` }}
        className={classNames(styles.tooltip, styles[placement], {
          [styles.slim]: !title,
          [styles.noHover]: noHover,
          [styles.disabled]: disabled,
        })}
      >
        {title && <h3 className={styles.title}>{title}</h3>}
        {content && <span className={styles.content}>{content}</span>}
      </div>
    </div>
  )
}
