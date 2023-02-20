import React from 'react'
import { TournamentController, TournamentControllerProps } from './'
import { Story } from '@storybook/react'

export default {
  title: 'Components/Tournament/TournamentController',
  component: TournamentController,
}

export const ExampleTournamentController: Story<TournamentControllerProps> = ({
  ...args
}) => <TournamentController {...args} />

ExampleTournamentController.args = { tournament: { id: 'someTournament' } }
