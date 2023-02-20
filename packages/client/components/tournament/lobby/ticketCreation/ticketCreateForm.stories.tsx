import React, { useState } from 'react'
import {
  FormValues,
  TicketCreateForm,
  TicketCreateFormProps,
} from './ticketCreateForm'
import { Story } from '@storybook/react'
import { Participant } from '@generated/graphql'

export default {
  title: 'Components/MatchLobby/TicketCreateForm',
  component: TicketCreateForm,
}

export const ExampleTicketCreateForm: Story<TicketCreateFormProps> = () => {
  const [results, setResults] = useState<FormValues>()
  return (
    <>
      <div
        style={{
          maxWidth: '500px',
        }}
      >
        <TicketCreateForm
          players={examplePlayers as Participant[]}
          onSubmit={(r) => setResults(r)}
        />
      </div>
      {JSON.stringify(results)}
    </>
  )
}

const examplePlayers = [
  {
    id: '1',
    user: {
      id: '1',
      displayName: 'Player 1',
    },
  },
  {
    id: '2',
    user: {
      id: '2',
      displayName: 'Player 2',
    },
  },
]
