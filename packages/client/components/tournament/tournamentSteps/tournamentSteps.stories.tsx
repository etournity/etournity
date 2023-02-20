import React from 'react'
import { Step, TournamentSteps } from './'
import { TournamentStepsProps } from './tournamentSteps'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Tournament/TournamentSteps',
  component: Step,
}

interface CustomArgs extends TournamentStepsProps {
  activeStep: number
}

export const ExampleTournamentStep: Story<CustomArgs> = ({ ...args }) => (
  <TournamentSteps {...args}>
    <Step name="Publish" />
    <Step number={6} name="CheckIn" />
    <Step number={9} name="Generate Bracket" />
  </TournamentSteps>
)

ExampleTournamentStep.args = {
  activeStep: 1,
}
