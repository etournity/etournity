import React, { ReactElement, ReactNode } from 'react'
import styles from './radio.module.scss'
import { RadioGroup } from './radioGroup'
import classNames from 'classnames'
import { onCheckedProps } from './'

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string
  label?: ReactNode
  value?: string
  children?: Array<ReactElement<RadioProps>>
  className?: string
  capture?: boolean | 'user' | 'environment'
  onChecked?: (node: onCheckedProps) => void
}

export const Radio: React.FC<RadioProps> = ({
  label,
  children,
  name,
  value,
  checked,
  className,
  onChecked,
  ...rest
}) => {
  const getChildrenAmount = (
    children: Array<ReactElement<RadioProps>>
  ): number => {
    const allChildren = (
      children: Array<ReactElement<RadioProps>>
    ): Array<ReactElement<RadioProps>> =>
      children.flatMap((child) => {
        if (child.props.children) {
          return allChildren(child.props.children)
        }

        return child
      })

    return allChildren(children).length
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      <label
        className={styles.radio}
        onChange={() => {
          if (value && name) {
            if (children) {
              const activeChild = children.find((child) => child.props.checked)
              onChecked?.({
                name,
                value,
                child: {
                  name: activeChild?.props.name ?? '',
                  value: activeChild?.props.value,
                },
              })
            } else {
              onChecked?.({ name, value })
            }
          }
        }}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          className={classNames(styles.input, {
            [styles.checked]: checked,
          })}
          {...rest}
        />
        <span className={styles.input} />
        <span className={styles.label}>{label}</span>
      </label>
      {children && (
        <div
          className={styles.childrenContainer}
          style={{
            height: checked ? `${getChildrenAmount(children) * 1.5}rem` : 0,
          }}
        >
          {checked && (
            <RadioGroup
              className={styles.children}
              style={{
                height: checked ? `${getChildrenAmount(children) * 1.5}rem` : 0,
              }}
              name={children[0].props.name ?? `sub-${name}`}
              onChecked={(child) =>
                onChecked?.({ name: name ?? '', value, child })
              }
            >
              {children.map((child) => (
                <Radio key={child.key} {...child.props} />
              ))}
            </RadioGroup>
          )}
        </div>
      )}
    </div>
  )
}
