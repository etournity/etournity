import React from 'react'
import { RoundStep, RoundStepProps } from './roundStep'
import { Story } from '@storybook/react'
import { RoundStatus } from '@generated/graphql'

export default {
  title: 'Components/Tournament/RoundStep',
  component: RoundStep,
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['upcoming', 'active', 'done'],
      },
    },
  },
}

interface CustomArgs extends RoundStepProps {
  number: number
}

export const ExampleRoundStep: Story<CustomArgs> = ({ ...args }) => (
  <RoundStep {...args} />
)

ExampleRoundStep.args = {
  number: 1,
  status: RoundStatus.Upcoming,
  matchesCount: 5,
  matchesDone: 1,
}
