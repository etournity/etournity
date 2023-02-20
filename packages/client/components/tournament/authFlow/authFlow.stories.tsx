import React, { useState } from 'react'
import { AuthFlow } from './'
import { Story } from '@storybook/react'
import { Button } from '@components/ui/button'

export default {
  title: 'Components/Tournament/AuthFlow',
  component: AuthFlow,
  argTypes: {
    path: {
      control: { type: 'select', options: ['moderator', 'player'] },
    },
  },
}

export const ExampleAuthFlow: Story = ({
  tournament,
  path,
  pageIndex,
  isLoggedIn,
  bracketsReady,
}) => {
  const [active, setActive] = useState(true)

  return (
    <div>
      <Button
        variant="primary"
        onClick={() => {
          setActive(true)
          console.log(active)
        }}
      >
        Yeeeet
      </Button>
      <AuthFlow
        path={path}
        pageIndex={pageIndex}
        modalActive={active}
        tournament={tournament}
        isLoggedIn={isLoggedIn}
        bracketsReady={bracketsReady}
        onClose={() => setActive(false)}
      />
    </div>
  )
}

ExampleAuthFlow.args = {
  pageIndex: 0,
  path: 'moderator',
  isLoggedIn: false,
  bracketsReady: false,
  tournament: {
    id: 'c00000000000000tournament',
    publishedAt: new Date('2021-07-07T00:00:00.000'),
    checkinStart: new Date('2022-07-26T18:00:00.000'),
    checkinEnd: new Date('2022-07-26T19:40:00.000'),
    date: new Date('2021-07-28T18:15:00.000'),
  },
}
