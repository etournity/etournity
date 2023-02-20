import classNames from 'classnames'
import React, { ReactElement, useEffect, useRef } from 'react'
import styles from './forceScroll.module.scss'

export interface ForceScrollProps {
  children: ReactElement
  onChange: (value: boolean) => void
  className?: string
}

export const ForceScroll: React.FC<ForceScrollProps> = ({
  children,
  onChange,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <=
      parseInt(e.target.clientHeight, 10) + 10
    if (bottom) onChange(true)
  }

  useEffect(() => {
    if (!((ref.current?.offsetHeight ?? 0) < (ref.current?.scrollHeight ?? 0)))
      onChange(true)
  }, [onChange])

  return (
    <div
      ref={ref}
      className={classNames(styles.forceScroll, className)}
      onScroll={handleScroll}
    >
      {children}
    </div>
  )
}
