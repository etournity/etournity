import React, { ReactNode } from 'react'
import styles from './button.module.scss'

interface ButtonProps {
  className?: string
  children?: ReactNode
  color: 'plain' | 'primary' | 'black'
  onClick?: () => void
}

// TODO Replace with MD3 buttons when they come out
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
