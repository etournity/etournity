import React, { InputHTMLAttributes } from 'react'
import styles from './checkbox.module.scss'
import classNames from 'classnames'
import { Icon } from '../icon'
import { SetRequired, Except } from 'type-fest'

interface CheckboxProps
  extends SetRequired<
    Except<InputHTMLAttributes<HTMLInputElement>, 'children'>,
    'name'
  > {
  borderColor?: string
  capture?: boolean | 'user' | 'environment'
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  children,
  name,
  checked,
  borderColor,
  ...rest
}) => (
  <div className={classNames(styles.container, className)}>
    <input
      {...rest}
      id={`checkbox ${name}`}
      name={name}
      type="checkbox"
      checked={checked}
    />
    <label
      htmlFor={`checkbox ${name}`}
      className={styles.label}
      style={{ borderColor }}
    />
    <Icon variant="tick" className={styles.checkmark} />
    <label htmlFor={`checkbox ${name}`} className={styles.children}>
      {children}
    </label>
  </div>
)
