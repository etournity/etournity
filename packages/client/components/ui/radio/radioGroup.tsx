import React, { ReactElement, useState, CSSProperties } from 'react'
import { RadioProps, Radio, onCheckedProps } from './index'
import styles from './radioGroup.module.scss'
import classNames from 'classnames'

export interface RadioGroupProps {
  className?: string
  style?: CSSProperties
  children: Array<ReactElement<RadioProps> | null>
  name?: string
  onChecked?: (value: onCheckedProps) => void
}
export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  className,
  style,
  name,
  onChecked,
  ...rest
}) => {
  const [selected, setSelected] = useState<string>()

  return (
    <div
      className={classNames(styles.group, className, {
        [styles.initial]: !selected,
      })}
      style={style}
      {...rest}
    >
      {children.map((child) => {
        if (!child) return null
        return (
          <Radio
            key={child?.props.value}
            className={styles.radio}
            checked={selected === child?.props.value}
            {...child?.props}
            name={name ?? child?.props.name}
            onChange={(e) => {
              setSelected(e.target.value)
            }}
            onChecked={onChecked}
          />
        )
      })}
    </div>
  )
}
