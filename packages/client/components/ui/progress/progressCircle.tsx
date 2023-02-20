import { Variants } from '@public/assets/icons/iconLib'
import React, { ReactNode, useEffect, useState } from 'react'
import { Icon } from '../icon'
import styles from './progressCircle.module.scss'
import classNames from 'classnames'

interface ProgressCircleProps {
  percent?: number
  progressColor?: string
  backgroundColor?: string
  strokeWidth?: number
  icon?: { variant?: Variants; size?: number; rotate?: number; color?: string }
  size?: number
  description?: string | ReactNode
  descriptionPlacement?: 'center' | 'left' | 'right' | 'top' | 'bottom'
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percent = 0,
  strokeWidth = 0.25,
  icon,
  progressColor,
  backgroundColor,
  size = 3,
  description,
  descriptionPlacement = 'center',
}) => {
  const [offset, setOffset] = useState(0)
  size *= 16
  strokeWidth *= 16
  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  useEffect(() => {
    setOffset(
      ((100 - (percent > 100 ? 100 : percent < 0 ? 0 : percent)) / 100) *
        circumference
    )
  }, [setOffset, circumference, percent])
  return (
    <div className={styles.wrapper} style={{ height: size, width: size }}>
      <svg width={size} height={size} fill={backgroundColor ?? styles.steel}>
        <defs>
          <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={styles.tertiary} />
            <stop offset="50%" stopColor={styles.primary} />
            <stop offset="100%" stopColor={styles.secondary} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={styles.mattBlack}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          stroke={progressColor ?? 'url(#gradient)'}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      </svg>
      {icon && (
        <Icon
          className={styles.icon}
          variant={icon.variant ?? 'people'}
          color={icon.color ?? progressColor ?? 'gradient'}
          size={icon.size ?? size / 32}
          style={{
            transform: `translate(-50%, -50%) rotate(${icon.rotate ?? 0}deg)`,
          }}
        />
      )}
      {description ? (
        <span className={classNames(styles.text, styles[descriptionPlacement])}>
          {description}
        </span>
      ) : (
        !icon && (
          <span
            className={classNames(styles.text, styles.center)}
            style={{ fontSize: size / 3 - 2 }}
          >
            {percent}%
          </span>
        )
      )}
    </div>
  )
}
