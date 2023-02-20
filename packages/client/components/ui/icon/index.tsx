import React from 'react'
import { iconPath, Variants } from '@iconLib'

export interface IconProps {
  variant: Variants
  size?: number
  className?: string
  color?: 'Success' | 'Error' | 'gradient' | string
  style?: React.CSSProperties
  rotate?: 'up' | 'down' | 'left' | 'right' | number
}

export const Icon: React.FC<IconProps> = ({
  className,
  color = '#efefef',
  variant,
  size = 1.5,
  style,
  rotate,
}) => {
  switch (rotate) {
    case 'up':
      rotate = 0
      break
    case 'down':
      rotate = 180
      break
    case 'left':
      rotate = 270
      break
    case 'right':
      rotate = 90
      break

    default:
      rotate = typeof rotate === 'number' ? rotate : undefined
  }

  const defaultStyles = {
    display: 'inline-block',
    verticalAlign: 'middle',
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    transition: 'transform 0.2s linear',
  }
  const styles = { ...defaultStyles, ...style }
  return (
    <svg
      className={className}
      height={`${size * 16}px`}
      width={`${size * 16}px`}
      style={styles}
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#f7f0ac" />
          <stop offset="50%" stopColor="#acf7f0" />
          <stop offset="100%" stopColor="#f0acf7" />
        </linearGradient>
      </defs>
      <path
        fill={color === 'gradient' ? 'url(#gradient)' : color}
        d={iconPath[variant]}
      />
    </svg>
  )
}
