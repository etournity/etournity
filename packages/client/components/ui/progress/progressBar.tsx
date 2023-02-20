import classnames from 'classnames'
import React from 'react'
import styles from './progressBar.module.scss'

interface ProgressBarProps {
  percent?: number
  fillColor?: string
  backgroundColor?: string
  strokeWidth?: number
  description?: string
  showDescription?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent = 0,
  strokeWidth = 0.25,
  description,
  showDescription = true,
  fillColor,
  backgroundColor,
  className,
}) => (
  <div className={classnames(styles.barWrapper, className)}>
    <div
      className={styles.barBackground}
      style={{ height: `${strokeWidth}rem`, background: fillColor }}
    >
      <div
        className={styles.barFill}
        style={{
          width: `${100 - (percent > 100 ? 100 : percent < 0 ? 0 : percent)}%`,
          height: `${strokeWidth}rem`,
          background: backgroundColor,
        }}
      />
    </div>
    {showDescription && (
      <span className={styles.text}>{description ?? `${percent}%`}</span>
    )}
  </div>
)
