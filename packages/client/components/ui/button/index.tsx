import React, { ReactNode, ForwardRefRenderFunction } from 'react'
import styles from './button.module.scss'
import classNames from 'classnames'
import { Loader } from '../loader'

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children?: ReactNode
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'error'
  type?: 'reset' | 'submit' | 'button'
}

const CustomButton: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    className,
    variant = 'primary',
    type = 'button',
    children,
    loading,
    disabled,
    onClick,
    ...rest
  },
  ref
) => (
  <button
    ref={ref}
    {...rest}
    // eslint-disable-next-line react/button-has-type
    type={type}
    className={classNames(styles.button, className, {
      [styles[variant]]: variant,
      [styles.loading]: loading,
    })}
    disabled={disabled}
    onClick={loading || disabled ? () => {} : onClick}
  >
    {loading && (
      <Loader
        style={{ marginRight: '0.5rem' }}
        color={variant === 'primary' ? 'black' : 'white'}
      />
    )}
    {children}
  </button>
)

export const Button = React.forwardRef(CustomButton)
