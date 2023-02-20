import { text } from '@storybook/addon-knobs'
import React from 'react'
import { Empty } from './'

export default {
  title: 'Components/UI/Empty',
  component: Empty,
}
export const ExampleEmptyComponent = () => (
  <Empty
    title={text('title', 'NOTHING IN HERE')}
    description={text(
      'description',
      'You have to be whitelisted to create tournaments'
    )}
  />
)
