import React from 'react'
import { Story } from '@storybook/react'
import { CreationFormCard } from './'
import { Select } from '@components/ui/select'

export default {
  title: 'Components/Tournament/CreationFormCard',
  component: CreationFormCard,
}

export const ExampleCreationFormCard: Story = ({ ...args }) => (
  <div style={{ display: 'flex' }}>
    <CreationFormCard {...args}>
      <Select placeholder="Game" />
      <Select placeholder="Game Mode" />
    </CreationFormCard>
  </div>
)

ExampleCreationFormCard.args = {
  title: 'Game Information',
  disabled: false,
}
