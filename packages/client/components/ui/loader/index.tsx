import React from 'react'
import styles from './loader.module.scss'
import classNames from 'classnames'

interface LoaderProps {
  color?: 'black' | 'white' | 'gradient' | string
  size?: number
  strokeWidth?: number
  style?: React.CSSProperties
  done?: boolean
}

export const Loader: React.FC<LoaderProps> = ({
  color,
  size = 1.5,
  style,
  strokeWidth = 0.125,
  done,
}) => {
  switch (color) {
    case 'black':
      color = styles.void
      break
    case 'white':
      color = styles.white
      break
    case 'gradient':
      color = `url(#fullGradient) ${styles.void}`
      break
    default:
      color = color ?? styles.white
  }

  const defaultStyles: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
  }
  const styling = { ...defaultStyles, ...style }
  size *= 16
  strokeWidth *= 16
  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  return (
    <svg
      className={classNames(styles.loader, { [styles.done]: done })}
      width={size}
      height={size}
      style={styling}
    >
      <defs>
        <linearGradient id="fullGradient" x1="0%" y1="100%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={styles.tertiary} />
          <stop offset="50%" stopColor={styles.primary} />
          <stop offset="100%" stopColor={styles.secondary} />
        </linearGradient>
      </defs>
      <circle
        cy={center}
        cx={center}
        r={radius}
        strokeDasharray={circumference}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDashoffset={((100 - (done ? 100 : 20)) / 100) * circumference}
        fill="none"
        style={{ transition: 'stroke-dashoffset 0.5s linear' }}
      />
    </svg>
  )
}
