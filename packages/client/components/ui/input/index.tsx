import React, { useState, useEffect } from 'react'
import styles from './input.module.scss'
import classNames from 'classnames'
export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  success?: boolean
  error?: boolean | null
  errorText?: string
  capture?: boolean | 'user' | 'environment'
  validate?: (
    value: string | number | readonly string[] | undefined
  ) => string | null
}

export const Input: React.FC<InputProps> = ({
  className,
  success,
  placeholder,
  width,
  disabled,
  validate,
  error,
  errorText,
  value,
  onChange,
  defaultValue,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState<
    string | number | readonly string[] | undefined
  >(defaultValue ?? value ?? '')

  useEffect(() => {
    setCurrentValue(value ?? '')
  }, [value, setCurrentValue])

  return (
    <div className={classNames(className, styles.container)}>
      <input
        {...props}
        data-cy={placeholder?.replace(/[^A-Z0-9]/gi, '') + 'Input'}
        disabled={disabled}
        value={currentValue}
        placeholder={placeholder}
        className={classNames(
          styles.input,
          { [styles.success]: success },
          { [styles.fullWidth]: !width },
          {
            [styles.error]: error ?? validate?.(value),
          }
        )}
        onChange={(e) => {
          setCurrentValue(e.target.value)
          onChange?.(e)
        }}
      />
      <p className={classNames(styles.errorText)}>
        {error && errorText ? errorText : validate?.(value)}
      </p>
      <div className={styles.labelWrapper}>
        <div className={styles.strokeContainer}>
          <p
            className={classNames(styles.label, {
              [styles.disabled]: disabled,
              [styles.hidden]: currentValue?.toString().length === 0,
            })}
          >
            {placeholder}
          </p>
          <div
            className={classNames(styles.stroke, {
              [styles.hidden]: currentValue?.toString()?.length === 0,
            })}
          />
        </div>
      </div>
    </div>
  )
}
