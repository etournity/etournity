import React from 'react'
import { Tooltip, TooltipProps } from './'
import { Button } from '../button'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/Tooltip',
  component: Tooltip,
  argTypes: {
    backgroundColor: {
      control: {
        type: 'color',
      },
    },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'left', 'right'],
      },
    },
  },
}

export const ExampleTooltip: Story<TooltipProps> = ({ ...args }) => (
  <div
    style={{
      height: '15rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
  >
    <Tooltip {...args}>
      <Button>{args.noHover ? 'Click Me!' : 'Hover Me!'}</Button>
    </Tooltip>
  </div>
)

ExampleTooltip.args = {
  noHover: false,
  content: 'This is some content.',
  title: 'Here, have a title!',
  backgroundColor: '#303030',
  placement: 'top',
}
