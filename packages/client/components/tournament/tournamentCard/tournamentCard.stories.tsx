import { StageType, TournamentStatus } from '@generated/graphql'
import React from 'react'
import { TournamentCard, TournamentCardProps } from '.'
import dayjs from 'dayjs'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/TournamentCard',
  component: TournamentCard,
}

export const ExampleTournamentCard: Story<TournamentCardProps> = ({
  ...args
}) => <TournamentCard {...args} />

ExampleTournamentCard.args = {
  tournament: {
    id: 'tournament',
    title: 'Test Tournament',
    date: dayjs('2021-01-01 18:00:00').toDate(),
    game: { title: 'Brawlhalla' },
    gameMode: { name: '1vs1' },
    playersCount: 8,
    hostUser: {
      id: '1',
      displayName: 'SpooderMan',
      linkedAccounts: [{ id: '1' }],
    },
    platforms: [{ name: 'PC' }],
    stages: [{ type: StageType.Single }],
    maxPlayers: 100,
    status: TournamentStatus.Started,
    roundsCount: 5,
    completedRounds: 3,
    activeRound: { id: '1' },
  },
  backgroundSrc:
    'https://images.unsplash.com/photo-1506865952017-eba1745396f6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1825&q=80',
}
