import React, { useEffect, useState } from 'react'
import styles from './select.module.scss'
import classNames from 'classnames'
import Fuse from 'fuse.js'
import { Icon } from '../icon'
import _ from 'lodash'

interface SelectProps<T> {
  name?: string
  className?: string
  success?: boolean
  placeholder?: string
  disabled?: boolean
  width?: number
  value?: string | null
  options?: Array<Option<T>>
  onChange?: (change: Option<T> | null) => void
  validate?: (value: Option<T> | null) => string | null
}

export interface Option<T> {
  title: string
  value: string
  data?: T | null
}

export const Select = <T,>({
  name,
  className,
  success,
  placeholder,
  width,
  disabled,
  validate,
  value,
  onChange,
  options = [],
}: SelectProps<T>): React.ReactElement => {
  const [title, setTitle] = useState<string>('')
  const [selected, setSelected] = useState<string | null>(null)

  const id = '_' + Math.random().toString(36).substr(2, 9)

  const selectedTitle = options.find((v) => v.value === selected)?.title

  const getOptionFromValue = (value: string | null): Option<T> | null => {
    const option = options.find((v) => v.value === value)
    return option ?? null
  }

  useEffect(() => {
    setSelected(value ?? selected ?? null)
    setTitle(selectedTitle ?? '')
  }, [value, setSelected, selected, selectedTitle])

  const onOptionSelect = (option: Option<T>) => {
    setSelected(option.value ?? null)
    onChange?.(option ?? null)
  }

  const onClear = () => {
    if (!disabled) {
      setTitle('')
      setSelected(null)
      onChange?.(null)
      setTimeout(() => {
        document.getElementById(id)?.focus()
      }, 100)
    }
  }

  const fuse = new Fuse(options, {
    includeScore: true,
    keys: ['title'],
  })

  const searchResult = fuse.search(title?.toString())

  return (
    <>
      <div
        className={classNames(className, styles.container, {
          [styles.fullWidth]: !width,
        })}
      >
        <input
          id={id}
          name={name}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={disabled || selected !== null}
          value={selectedTitle ?? title}
          placeholder={placeholder}
          className={classNames(
            styles.input,
            { [styles.success]: success },
            { [styles.error]: validate?.(getOptionFromValue(selected)) },
            { [styles.selected]: selected && !disabled }
          )}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={(e) => {
            const option = options.find(
              (option) =>
                option.title.toLowerCase() === e.target.value.toLowerCase()
            )
            if (option) onOptionSelect(option)
            else setTitle('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              setSelected(searchResult?.[0]?.item?.value ?? null)
          }}
        />
        <div
          data-cy={placeholder?.replace(/[^A-Z0-9]/gi, '') + 'Select'}
          className={styles.clickDetector}
          onClick={
            selected ? onClear : () => document.getElementById(id)?.focus()
          }
        />
        <div
          className={classNames(styles.iconWrapper)}
          onClick={
            selected ? onClear : () => document.getElementById(id)?.focus()
          }
        >
          <Icon
            variant={selected ? 'close' : 'chevron'}
            rotate={selected ? 0 : 180}
            size={0.625}
            color={disabled ? styles.inputFontDisabled : styles.white}
          />
        </div>
        <div className={styles.labelWrapper}>
          <div className={styles.strokeContainer}>
            <p
              className={classNames(styles.label, {
                [styles.disabled]: disabled,
                [styles.hidden]: title?.toString().length === 0,
              })}
            >
              {placeholder}
            </p>
            <div
              className={classNames(styles.stroke, {
                [styles.hidden]: title?.toString().length === 0,
              })}
            />
          </div>
        </div>
        <div className={styles.relativeWrapper}>
          <div className={classNames(styles.optionsWrapper)}>
            {(title.length > 0
              ? searchResult?.map((result) => result.item)
              : options
            ).map((option) => (
              <div
                key={option.title}
                className={styles.option}
                onMouseDown={() => onOptionSelect(option)}
              >
                {option.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className={classNames(styles.errorText)} data-cy="errorText">
        {validate?.(getOptionFromValue(selected))}
      </p>
    </>
  )
}
