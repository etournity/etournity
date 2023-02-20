import React from 'react'
import { Step, StepProps } from './step'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Tournament/Step',
  component: Step,
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['upcoming', 'active', 'done'],
      },
    },
  },
}

interface CustomArgs extends StepProps {
  number: number
  name: string
}

export const ExampleStep: Story<CustomArgs> = ({ ...args }) => (
  <Step {...args} />
)

ExampleStep.args = {
  name: 'Publish',
  number: 1,
  variant: 'done',
}
