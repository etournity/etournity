import React, { useState } from 'react'
import { RoundController, RoundControllerProps } from './'
import { Story } from '@storybook/react'
import { RoundStatus } from '@generated/graphql'

export default {
  title: 'Components/Tournament/RoundController',
  component: RoundController,
}

export const ExampleRoundController: Story<RoundControllerProps> = ({
  ...args
}) => {
  const [rounds, setRounds] = useState(args.rounds)

  return (
    <RoundController
      {...args}
      rounds={rounds}
      onChange={(change) => {
        setRounds(
          rounds.map((round) =>
            round.id === change.roundId
              ? { ...round, locked: change.change === 'locked' }
              : round
          )
        )
      }}
    />
  )
}

ExampleRoundController.args = {
  rounds: [
    {
      id: 'c000000000000000000round',
      matches: [
        {
          id: 'ckp6qu18400331tozvzhhyyy4',
        },
        {
          id: 'ckp6qu18400361tozffppfskz',
        },
        {
          id: 'ckp6qu18500391toz5a3yt60j',
        },
        {
          id: 'ckp6qu18500421tozl9c0lqwr',
        },
        {
          id: 'ckp6qu18500451toz56ioq4w4',
        },
        {
          id: 'ckp6qu18600481tozqh5u13oj',
        },
        {
          id: 'ckp6qu18600511tozyci387lu',
        },
        {
          id: 'ckp6qu18600541tozxmg2xqng',
        },
        {
          id: 'c000000000000000000match',
        },
      ],
      completedMatches: 4,
      status: RoundStatus.Completed,
    },
    {
      id: 'ckp6qu18700571toz24m5srx4',
      matches: [
        {
          id: 'ckp6qu18700581toz2z7oasyf',
        },
        {
          id: 'ckp6qu18700591tozu31d84g9',
        },
        {
          id: 'ckp6qu18700601tozeoe531mu',
        },
        {
          id: 'ckp6qu18800611toz8fiboxh1',
        },
      ],
      completedMatches: 2,
      status: RoundStatus.Active,
    },
    {
      id: 'ckp6qu18800621tozsgecmmm7',
      matches: [
        {
          id: 'ckp6qu18800631tozcz8eydt6',
        },
        {
          id: 'ckp6qu18800641tozwr3oqj2u',
        },
      ],
      completedMatches: 0,
      status: RoundStatus.Upcoming,
      locked: true,
    },
    {
      id: 'ckp6qu18900651tozh5wy7hb2',
      matches: [
        {
          id: 'ckp6qu18900661toztvj2hxzi',
        },
      ],
      completedMatches: 0,
      status: RoundStatus.Upcoming,
    },
    {
      id: 'ckp6qu18900651tozh567wy7hb2',
      matches: [
        {
          id: 'ckp6qu18900661toztvj2hxzi',
        },
      ],
      completedMatches: 0,
      status: RoundStatus.Upcoming,
    },
    {
      id: 'ckp6qu18900651t345ozh5wy7hb2',
      matches: [
        {
          id: 'ckp6qu18900661toztvj2hxzi',
        },
      ],
      completedMatches: 0,
      status: RoundStatus.Upcoming,
    },
  ],
}
