import React from 'react'
import { TournamentInfoSummary, TournamentInfoSummaryProps } from './'
import { Story } from '@storybook/react'
import { StageType, TournamentStatus } from '@generated/graphql'

export default {
  title: 'Components/Tournament/TournamentInfoSummary',
  component: TournamentInfoSummary,
}

interface CustomArgs extends TournamentInfoSummaryProps {}

export const ExampleTournamentInfoSummary: Story<CustomArgs> = ({
  ...args
}) => (
  <div style={{ width: '25.5625rem', marginTop: '2rem' }}>
    <TournamentInfoSummary {...args} />
  </div>
)

ExampleTournamentInfoSummary.args = {
  tournament: {
    id: 'c00000000000000tournament',
    title: 'PogPongs Tournament',
    maxPlayers: 100,
    gameMode: { id: '1', name: 'PogPong', teamSize: 3 },
    participants: [
      {
        id: 'c000000000000000participantO',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant1',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant2',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant3',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant4',
        isCheckedIn: false,
      },
      {
        id: 'c000000000000000participant5',
        isCheckedIn: false,
      },
      {
        id: 'c000000000000000participantO',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant1',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant2',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant3',
        isCheckedIn: true,
      },
      {
        id: 'c000000000000000participant4',
        isCheckedIn: false,
      },
      {
        id: 'c000000000000000participant5',
        isCheckedIn: false,
      },
    ],
    activeRound: {
      playersInRound: 2,
    },
    stages: [
      {
        type: StageType.Single,
      },
    ],
    platforms: [
      {
        name: 'PC',
      },
    ],
    date: '2022-01-01T12:00:00.000Z',
    checkinStart: '2021-11-01T11:00:00.000Z',
    checkinEnd: '2022-01-01T11:30:00.000Z',
    status: TournamentStatus.Published,
  },
}
