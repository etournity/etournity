import React from 'react'
import { Story } from '@storybook/react'
import { MatchStatus } from '@generated/graphql'
import BracketViz, { Team } from '.'

export default {
  title: 'Components/Tournament/BracketView',
  component: BracketViz,
}

const roundCount = 3

let matchCounter = 0

let teams: Team[] = Array(2 ** roundCount)
  .fill(0)
  .map((_, i) => ({
    id: `c000000000000000000team${i}`,
    name: `VeryLongNameForATea${i}`,
    seed: i + 1,
    avatar: '',
  }))

const rounds = Array(roundCount)
  .fill(0)
  .map((_, i) => {
    if (i > 0) teams = teams.filter((_, i) => i % 2 === 0)
    return {
      id: `c000000000000000000round${i}`,
      number: i,
      bestOf: 3,
      matches: Array(2 ** (roundCount - i - 1))
        .fill(0)
        .map((_, j) => {
          matchCounter++
          return {
            id: `c000000000000000000match${matchCounter}`,
            number: matchCounter,
            status:
              matchCounter === 7
                ? MatchStatus.Started
                : matchCounter === 5
                ? MatchStatus.Error
                : MatchStatus.Scheduled,
            teamResults: [
              { team: teams[j * 2], score: 2 },
              { team: teams[2 * j + 1], score: 1 },
            ],
          }
        }),
    }
  })

export const ExampleBracketView: Story = () => (
  <BracketViz rounds={rounds} userTeamId="c000000000000000000team0" />
)
