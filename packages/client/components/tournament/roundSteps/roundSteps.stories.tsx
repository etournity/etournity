import React from 'react'
import { RoundStep, RoundSteps } from '.'
import { RoundStepsProps } from './roundSteps'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Tournament/RoundSteps',
  component: RoundStep,
}

interface CustomArgs extends RoundStepsProps {
  activeStep: number
}

export const ExampleRoundSteps: Story<CustomArgs> = ({ ...args }) => (
  <RoundSteps {...args}>
    <RoundStep matchesCount={4} matchesDone={1} />
    <RoundStep matchesCount={4} matchesDone={2} />
    <RoundStep matchesCount={4} matchesDone={3} />
    <RoundStep matchesCount={4} matchesDone={3} />
  </RoundSteps>
)

ExampleRoundSteps.args = {
  activeStep: 1,
}
