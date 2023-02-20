import React, { ReactElement, useState, useRef, useEffect } from 'react'
import { Icon } from '../icon'
import { Variants } from '@public/assets/icons/iconLib'
import classNames from 'classnames'
import styles from './fam.module.scss'

export interface FloatingActionMenuProps {
  children: Array<ReactElement | null>
  icon?: Variants
  activator?: ReactElement
  className?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  giveWay?: 'top' | 'bottom'
  preventClose?: boolean
  disableOnClick?: boolean
}
export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  children,
  icon,
  className,
  placement = 'left',
  giveWay,
  activator,
  preventClose,
  disableOnClick,
}) => {
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const handleClick = (e: Event) => {
    if (!menu.current?.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (open) {
      document.addEventListener('click', handleClick)
    } else {
      document.removeEventListener('click', handleClick)
    }

    return () => document.removeEventListener('click', handleClick)
  }, [open])
  return (
    <div
      ref={menu}
      className={classNames(className, styles.wrapper, { [styles.open]: open })}
    >
      <div
        className={styles.activator}
        onClick={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
      >
        {activator ?? <Icon variant={icon ?? 'kebab'} />}
      </div>
      <div
        className={classNames(styles.menu, styles[placement], {
          [styles['giveWay-' + giveWay]]: giveWay,
        })}
      >
        {children.map((child) => {
          if (!child) return null
          return (
            <child.type
              key={child.key}
              className={styles.option}
              {...child.props}
              onClick={(props: unknown) =>
                !disableOnClick &&
                setTimeout(() => {
                  child.props.onClick?.(props)
                  if (!preventClose) setOpen(false)
                }, 100)
              }
            />
          )
        })}
      </div>
    </div>
  )
}
