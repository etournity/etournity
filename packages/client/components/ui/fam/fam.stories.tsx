import { Story } from '@storybook/react'
import React from 'react'
import { FloatingActionMenu, FloatingActionMenuProps } from './'
import { iconPath } from '@iconLib'

export default {
  title: 'Components/UI/FloatingActionMenu',
  component: FloatingActionMenu,
  argTypes: {
    placement: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'left', 'right'],
      },
    },
    icon: {
      control: {
        type: 'select',
        options: Object.keys(iconPath),
      },
    },
  },
}
export const ExampleFloatingActionMenu: Story<FloatingActionMenuProps> = ({
  ...args
}) => (
  <div
    style={{
      height: '15rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
  >
    <FloatingActionMenu {...args}>
      <div key="somekey">Option 1</div>
      <div key="someOtherKey">Option 2</div>
    </FloatingActionMenu>
  </div>
)
ExampleFloatingActionMenu.args = {
  placement: 'left',
  icon: 'kebab',
}
