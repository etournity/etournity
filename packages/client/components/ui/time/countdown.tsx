import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import styles from './countdown.module.scss'
import { Icon } from '../icon'
import classNames from 'classnames'

dayjs.extend(isSameOrAfter)
dayjs.extend(duration)
dayjs.extend(relativeTime)

interface CountdownProps {
  onEnd?: () => void
  startTime?: Date
  endTime: Date
  hideIcon?: boolean
  color?: string
  className?: string
  format?: string
  iconSize?: number
}
/** A custom countdown component
 * @param {() => void} onEnd Callback that gets called when timer hits 0
 * @param {Date} startTime customizable start time, defaults to render time
 * @param {Date} endTime time in the future to count down to
 * @param {boolean} hideIcon hides 'clock' Icon
 * @param {string} color controls color of Icon and timer
 * @parma {className} class name of component
 * @param {format} format of time remaining
 * @param {iconSize} size of icon
 */
export const Countdown: React.FC<CountdownProps> = ({
  startTime = dayjs(),
  endTime,
  hideIcon = false,
  onEnd = () => {},
  color = '#efefef',
  className,
  format,
  iconSize = 1.5,
}) => {
  const [currentTime, setCurrentTime] = useState(startTime)

  let timer = dayjs(endTime).diff(
    dayjs(currentTime).isBefore(startTime) ? startTime : currentTime
  )

  if (dayjs(currentTime).isSameOrAfter(endTime)) {
    timer = 0
    onEnd()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (dayjs(currentTime).isBefore(endTime)) {
        setCurrentTime(dayjs())
      }
    }, 500)
    return () => clearInterval(interval)
  }, [currentTime, endTime, timer])

  const countdownFormatter = (time: number, format: string) => {
    const duration = dayjs.duration(time)

    const codes = [
      ['dd', duration.days().toString().padStart(2, '0')],
      ['hh', duration.hours().toString().padStart(2, '0')],
      ['mm', duration.minutes().toString().padStart(2, '0')],
      ['ss', duration.seconds().toString().padStart(2, '0')],
    ]

    let formatted = format
    codes.forEach((code) => {
      formatted = formatted.replace(code[0], code[1])
    })

    return formatted
  }

  const timeRemaining = format
    ? countdownFormatter(timer, format)
    : dayjs.duration(timer).humanize()

  return (
    <div className={classNames(styles.countdown, className)} style={{ color }}>
      {!hideIcon && <Icon variant="clock" color={color} size={iconSize} />}
      {timeRemaining}
    </div>
  )
}
