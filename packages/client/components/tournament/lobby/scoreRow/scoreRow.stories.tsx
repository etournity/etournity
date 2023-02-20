import React from 'react'
import { withKnobs, text, select, boolean } from '@storybook/addon-knobs'
import { ScoreRow } from './'

export default {
  title: 'Components/Matchlobby/ScoreRow',
  component: ScoreRow,
  decorators: [withKnobs],
}
export const ExampleRow = () => (
  <div style={{ width: '20rem' }}>
    <ScoreRow
      type="display"
      gameNumber={1}
      areScoresEqual={boolean('Equal Scores?', true)}
      currentDisplay={{
        submission: select(
          'CurrentTeam Display',
          ['current', 'opponent', 'both', 'none'],
          'both'
        ),
        label: text('Current Label', 'Win'),
      }}
      opponentDisplay={{
        submission: select(
          'OpponentTeam Display',
          ['current', 'opponent', 'both', 'none'],
          'none'
        ),
        label: text('Opponent Label', 'Loss'),
      }}
    />
  </div>
)
