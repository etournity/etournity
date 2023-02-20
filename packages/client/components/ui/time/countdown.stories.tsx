import React from 'react'
import { withKnobs, boolean, number, date, color } from '@storybook/addon-knobs'
import { Countdown } from './'
import dayjs from 'dayjs'

export default {
  title: 'Components/UI/Countdown',
  component: Countdown,
  decorators: [withKnobs],
}
export const ExampleCountdown = () => {
  const startTime = dayjs(date('Start Time', dayjs().toDate())).toDate()
  const endTime = dayjs()
    .add(number('Countdown Duration (minutes)', 5), 'minutes')
    .toDate()
  return (
    <div
      style={{
        height: '5rem',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Countdown
        hideIcon={boolean('Hide Icon', false)}
        startTime={startTime}
        endTime={endTime}
        color={color('Color', '#efefef')}
      />
    </div>
  )
}
