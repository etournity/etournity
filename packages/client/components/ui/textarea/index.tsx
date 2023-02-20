import React, { useState, useEffect } from 'react'
import styles from './textarea.module.scss'
import classNames from 'classnames'

interface TextAreaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  success?: boolean
  validate?: (
    value: string | number | readonly string[] | undefined
  ) => string | null
}

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  success,
  placeholder,
  disabled,
  validate,
  value,
  onChange,
  defaultValue,
  rows = 3,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState<
    string | number | readonly string[] | undefined
  >(defaultValue ?? value ?? '')

  useEffect(() => {
    if (value) setCurrentValue(value)
  }, [value, setCurrentValue])

  return (
    <div className={classNames(className, styles.container)}>
      <textarea
        {...props}
        rows={rows}
        disabled={disabled}
        value={currentValue}
        placeholder={placeholder}
        className={classNames(
          styles.input,
          { [styles.success]: success },
          { [styles.error]: validate?.(value) }
        )}
        onChange={(e) => {
          setCurrentValue(e.target.value)
          onChange?.(e)
        }}
      />
      <p className={classNames(styles.errorText)}>{validate?.(value)}</p>
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
              [styles.hidden]: currentValue?.toString().length === 0,
            })}
          />
        </div>
      </div>
    </div>
  )
}
