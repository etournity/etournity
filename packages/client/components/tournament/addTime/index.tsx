import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import styles from './addTime.module.scss'

export interface AddTimeProps {
  endDate: Date
  onAddTime: (time: Date) => void
  className?: string
}

export const AddTime: React.FC<AddTimeProps> = ({
  endDate,
  className,
  onAddTime,
}) => {
  const [minutes, setMinutes] = useState(15)
  const [checkInEnd, setCheckInEnd] = useState(endDate)

  const addTime = () => {
    const newEnd = dayjs(checkInEnd).add(minutes, 'm').toDate()
    setCheckInEnd(newEnd)
    setMinutes(15)
    onAddTime(newEnd)
  }

  return (
    <div className={classNames(styles.main, className)}>
      <div className={styles.upperDiv}>
        <div
          className={styles.leftDiv}
          onClick={() => document.getElementById('addTimeInput')?.focus()}
        >
          <input
            id="addTimeInput"
            value={minutes}
            type="number"
            placeholder="15"
            onChange={(e) => {
              const value = e.target.valueAsNumber
              if ((value <= 9999 && value > 0) || isNaN(value))
                setMinutes(value)
            }}
          />
          <span>min.</span>
        </div>
        <div className={styles.rightDiv} onClick={addTime}>
          <div>Add Time</div>
        </div>
      </div>
    </div>
  )
}
