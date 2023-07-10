import React, { ReactNode } from 'react'
import styles from './button.module.scss'

interface ButtonProps {
  className?: string
  children?: ReactNode
  color: 'plain' | 'primary'
  onClick?: () => void
}

const Button = ({
  className = '',
  children,
  color,
  onClick,
  ...rest
}: ButtonProps) => (
  <button
    className={`${styles.button} ${styles[`color${color}`]} ${className}`}
    type="button"
    onClick={onClick ? onClick : () => {}}
    {...rest}
  >
    {children}
  </button>
)

export default Button
