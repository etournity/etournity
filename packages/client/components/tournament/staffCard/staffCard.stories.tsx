import React, { useState } from 'react'
import { StaffCard, StaffCardProps } from './'
import { Story } from '@storybook/react'
import { ParticipantRoleType } from '@generated/graphql'

export default {
  title: 'Components/Tournament/StaffCard',
  component: StaffCard,
}
interface CustomProps extends StaffCardProps {}
export const ExampleStaffCard: Story<CustomProps> = ({ ...args }) => {
  const [msg, setMsg] = useState('')
  return (
    <>
      <div
        style={{
          backgroundColor: '#232323',
          padding: '1rem',
          marginLeft: '5rem',
          width: 'max-content',
        }}
      >
        <StaffCard {...args} onKick={() => setMsg('Kick Button clicked!')} />
      </div>
      <div>{msg}</div>
    </>
  )
}

ExampleStaffCard.args = {
  kickable: true,
  participant: {
    roles: [
      { type: ParticipantRoleType.Player },
      { type: ParticipantRoleType.Moderator },
    ],
    user: {
      displayName: 'Participant',
      gameUserFromTournament: { inGameName: 'GamerBoy' },

      linkedAccounts: [
        { provider: 'custom', discriminator: '1234', avatar: '' },
      ],
    },
  },
  accountProvider: 'custom',
}
