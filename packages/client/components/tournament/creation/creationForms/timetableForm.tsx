import React, { useState, useEffect } from 'react'
import { DateTimePicker } from './dateTimePicker'
import styles from './timetableForm.module.scss'
import dayjs from 'dayjs'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

interface TimetableFormProps {
  value?: TimetableFormValue
  maxCheckinDuration?: number
  onChange?: (value: TimetableFormValue) => void
  validate?: (
    value?: TimetableFormValue
  ) => Partial<Record<keyof TimetableFormValue, string | null>> | null
}

export interface TimetableFormValue {
  checkInStart?: Date | null
  checkInEnd?: Date | null
  plannedStart?: Date | null
  noShow?: number | null
}

export const TimetableForm: React.FC<TimetableFormProps> = ({
  value,
  onChange,
  validate,
  maxCheckinDuration = 60,
}) => {
  const [checkinFrame, setCheckinFrame] = useState<number>(0)
  const [noShowDisabled, setNoShowDisabled] = useState<boolean>(false)

  useEffect(() => {
    setCheckinFrame(
      value?.checkInStart && value?.checkInEnd
        ? (value?.checkInEnd?.getTime() - value?.checkInStart?.getTime()) /
            1000 /
            60
        : 0
    )
  }, [value?.checkInEnd, value?.checkInStart, setCheckinFrame])

  useEffect(() => {
    if (checkinFrame > maxCheckinDuration) setCheckinFrame(maxCheckinDuration)
  }, [checkinFrame, setCheckinFrame, maxCheckinDuration])

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.pickers}>
          <div>
            <div>
              <p>1. Registration</p>
            </div>
            <div>
              <p>Starts on Publish</p>
            </div>
          </div>
          <div>
            <div>
              <p>2. Check-in start</p>
            </div>
            <div>
              <DateTimePicker
                minDate={new Date()}
                value={value?.checkInStart}
                onChange={(val) =>
                  onChange?.({
                    ...value,
                    checkInStart: val,
                    checkInEnd: calculateCheckInEnd(
                      maxCheckinDuration,
                      val,
                      value?.checkInEnd
                    ),
                  })
                }
              />
            </div>
          </div>
          <div>
            <div>
              <p>3. Check-in end</p>
            </div>
            <div>
              <DateTimePicker
                minDate={
                  dayjs(value?.checkInStart).add(15, 'minutes').toDate() ??
                  new Date()
                }
                maxDate={
                  dayjs(value?.checkInStart)
                    .add(maxCheckinDuration, 'm')
                    .toDate() ?? null
                }
                value={value?.checkInEnd}
                onChange={(val) =>
                  onChange?.({
                    ...value,
                    checkInEnd: calculateCheckInEnd(
                      maxCheckinDuration,
                      value?.checkInStart,
                      val
                    ),
                  })
                }
              />
            </div>
          </div>
          <div>
            <div>
              <p>4. (planned) start**</p>
            </div>
            <div>
              <DateTimePicker
                minDate={value?.checkInEnd ?? new Date()}
                value={value?.plannedStart}
                onChange={(val) => onChange?.({ ...value, plannedStart: val })}
              />
            </div>
          </div>
        </div>
        <div className={styles.interval}>
          <div className={styles.bracket} />
          <div className={styles.bracket} />
          <div className={styles.label}>
            <input
              contentEditable
              disabled={value?.checkInStart === null}
              className={styles.labelInput}
              value={checkinFrame === 0 ? '' : checkinFrame}
              onChange={(e) => {
                let frame = Number.parseInt(e.target.value, 10)
                if (isNaN(frame)) frame = 0
                setCheckinFrame(
                  frame > maxCheckinDuration
                    ? maxCheckinDuration
                    : Math.ceil(frame)
                )
                if (value?.checkInStart)
                  onChange?.({
                    ...value,
                    checkInEnd: dayjs(value?.checkInStart)
                      .add(
                        frame > maxCheckinDuration ? maxCheckinDuration : frame,
                        'm'
                      )
                      .toDate(),
                  })
              }}
            />
            <p>min.*</p>
          </div>
        </div>
      </div>
      <p className={styles.errorText}>
        {validate?.(value)?.checkInStart ??
          validate?.(value)?.checkInEnd ??
          validate?.(value)?.plannedStart}
      </p>
      <div className={styles.disclaimer}>
        <p>*the maximum checkin duration is 60 minutes.</p>
        <p>**can be changed later.</p>
      </div>
      <div className={styles.timer}>
        <TextField
          fullWidth
          defaultValue={10}
          variant="standard"
          value={value?.noShow}
          type="number"
          label="Match Disqualify Timer"
          disabled={noShowDisabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">Minutes</InputAdornment>
            ),
            inputProps: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              min: 0,
              max: 60,
            },
          }}
          onChange={(e) =>
            onChange?.({
              ...value,
              noShow: noShowDisabled ? 0 : parseInt(e.target.value, 10),
            })
          }
        />
        <FormControlLabel
          label="Disable"
          control={
            <Checkbox
              inputProps={{ 'aria-label': 'controlled' }}
              checked={noShowDisabled}
              onChange={(e) => {
                onChange?.({
                  ...value,
                  noShow: e.target.checked ? 0 : 10,
                })
                setNoShowDisabled(e.target.checked)
              }}
            />
          }
        />
      </div>
      <p className={styles.errorText}>{validate?.(value)?.noShow}</p>
    </>
  )
}

const calculateCheckInEnd = (
  maxCheckinDuration: number,
  checkInStart?: Date | null,
  newCheckInEnd?: Date | null
) => {
  if (
    checkInStart &&
    dayjs(newCheckInEnd).diff(dayjs(checkInStart), 'm') > maxCheckinDuration
  )
    return dayjs(checkInStart).add(maxCheckinDuration, 'm').toDate()
  if (checkInStart && dayjs(newCheckInEnd).diff(dayjs(checkInStart), 'm') < 0)
    return checkInStart
  return newCheckInEnd
}
