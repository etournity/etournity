import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './searchBar.module.scss'
import { Icon } from '../icon'

export interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (change: string) => void
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  className,
}) => {
  const [hover, setHover] = useState(false)
  const [click, setClick] = useState(false)
  const [currentValue, setCurrentValue] = useState<string>(value ?? '')

  useEffect(() => {
    if (value) setCurrentValue(value)
  }, [value, setCurrentValue])

  return (
    <div
      className={classNames(styles.searchBar, styles.states, className, {
        [styles.click]: click,
      })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.icon}>
        <Icon
          variant="search"
          size={1}
          color={hover || click ? styles.white : styles.middleGrey}
        />
      </div>
      <div className={styles.placeholder}>
        <input
          placeholder={placeholder ?? 'SEARCH'}
          className={classNames(styles.input, styles.states, {
            [styles.click]: click,
          })}
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value)
            onChange?.(e.target.value)
          }}
          onFocus={() => setClick(true)}
          onBlur={() => setClick(false)}
        />
      </div>
      <div
        className={classNames(styles.x, {
          [styles.hidden]: !currentValue,
        })}
        onClick={() => {
          setCurrentValue('')
          onChange?.('')
        }}
      >
        <Icon variant="close" size={0.5} color={styles.white} />
      </div>
    </div>
  )
}
