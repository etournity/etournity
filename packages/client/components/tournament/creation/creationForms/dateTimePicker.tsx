import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './dateTimePicker.module.scss'

interface DateTimePickerProps {
  value?: Date | null
  onChange?: (value: Date | null) => void
  minDate?: Date | null
  maxDate?: Date | null
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const minTime = dayjs(rest.minDate).isSame(value ?? new Date(), 'day')
    ? rest.minDate ?? undefined
    : dayjs().set('hour', 0).set('minute', 0).toDate()

  return (
    <DatePicker
      showTimeSelect
      fixedHeight
      calendarStartDay={1}
      selected={value}
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="dd.MM.yyyy | HH:mm"
      customInput={React.createElement(ExampleCustomInput)}
      minTime={minTime}
      maxTime={dayjs().set('hour', 23).toDate()}
      onChange={(val) => !Array.isArray(val) && onChange?.(val)}
      {...rest}
    />
  )
}

interface ExampleCustomInputProps {
  value: string
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ExampleCustomInput = forwardRef<HTMLDivElement, ExampleCustomInputProps>(
  ({ value, onClick }, ref) => (
    <div
      ref={ref}
      data-cy="dateTimePicker"
      className={classNames(styles.picker, { [styles.selected]: value })}
      onClick={onClick}
    >
      {value ? value : 'Pick Time & Date'}
    </div>
  )
)

ExampleCustomInput.displayName = 'ExampleCustomInput'
