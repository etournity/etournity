import React, { useState } from 'react'
import {
  ResolveTicketForm,
  ResolveTicketFormProps,
  ResolveFormValues,
} from './resolveTicket'
import { Story } from '@storybook/react'
import { TicketType } from '@generated/graphql'

export default {
  title: 'Components/Tournament/ResolveTicketForm',
  component: ResolveTicketForm,
}

export const ExampleResolveTicketForm: Story<ResolveTicketFormProps> = ({
  ticket,
}) => {
  const [results, setResults] = useState<ResolveFormValues>()
  return (
    <>
      <div
        style={{
          maxWidth: '50rem',
        }}
      >
        <ResolveTicketForm ticket={ticket} onSubmit={(r) => setResults(r)} />
      </div>
      {JSON.stringify(results)}
    </>
  )
}

ExampleResolveTicketForm.args = {
  ticket: {
    id: 'abcd',
    type: TicketType.PlayerReport,
    match: {
      opponents: [
        {
          id: '1234',
          name: 'Team1',
          participants: [{ user: { id: '11223344' } }],
        },
        {
          id: '5678',
          name: 'Team2',
          participants: [{ user: { id: '55667788' } }],
        },
      ],
    },
    reporter: {
      id: '11223344',
      linkedAccounts: [
        {
          id: '12345678',
          username: 'Player1',
          discriminator: '1111',
          provider: 'custom',
        },
      ],
    },
    reported: {
      id: '55667788',
      linkedAccounts: [
        {
          id: '87654321',
          username: 'Player2',
          discriminator: '2222',
          provider: 'custom',
        },
      ],
    },
  },
}
