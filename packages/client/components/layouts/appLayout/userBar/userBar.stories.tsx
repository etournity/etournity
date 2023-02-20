import React from 'react'
import { Story } from '@storybook/react'
import { UserBar } from './'

export default {
  title: 'Components/Layout/UserBar',
  component: UserBar,
}

export const ExampleNavigation: Story = () => (
  <div style={{ display: 'flex' }}>
    <UserBar />
  </div>
)
