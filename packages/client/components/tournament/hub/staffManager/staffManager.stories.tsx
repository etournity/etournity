import { ParticipantRoleType } from '@generated/graphql'
import { Story } from '@storybook/react'
import React from 'react'
import { StaffManager, StaffManagerProps } from '.'

export default {
  title: 'Components/Hub/StaffManager',
  component: StaffManager,
}
export const ExampleStaffManager: Story<StaffManagerProps> = ({ ...args }) => (
  <div
    style={{
      backgroundColor: '#303030',
      width: '30rem',
      padding: '1rem',
    }}
  >
    <StaffManager {...args} />
  </div>
)

ExampleStaffManager.args = {
  hasAddPermission: true,
  hasPermissionToKick: () => true,
  onAdd: () => console.log('Added'),
  onDeny: () => console.log('Denied'),
  onKick: () => console.log('Kicked'),

  staffList: [
    {
      id: '1234',
      isCurrentUser: true,
      roles: [
        {
          type: ParticipantRoleType.Moderator,
        },
      ],
      user: {
        displayName: 'MyUser',
        linkedAccounts: [
          {
            provider: 'custom',
            discriminator: '1111',
            username: 'MyDiscordUser',
          },
        ],
      },
    },
    {
      id: '5678',
      isCurrentUser: false,
      roles: [
        {
          type: ParticipantRoleType.Moderator,
        },
        {
          type: ParticipantRoleType.Player,
        },
      ],
      user: {
        displayName: 'OtherUser',
        linkedAccounts: [
          {
            provider: 'custom',
            discriminator: '2222',
            username: 'OtherDiscordUser',
          },
        ],
        gameUsers: [{ inGameName: 'SomeGameUser' }],
      },
    },
    {
      id: '7777',
      isCurrentUser: false,
      roles: [
        {
          type: ParticipantRoleType.Moderator,
        },
        {
          type: ParticipantRoleType.Player,
        },
      ],
      user: {
        displayName: 'DifferentUser',
        linkedAccounts: [
          {
            provider: 'custom',
            discriminator: '2222',
            username: 'SomeDiscordUser',
          },
        ],
        gameUsers: [{ inGameName: 'GameUser' }],
      },
    },
    {
      id: '8888',
      isCurrentUser: false,
      roles: [
        {
          type: ParticipantRoleType.Moderator,
        },
      ],
      user: {
        displayName: 'ThisUser',
        linkedAccounts: [
          {
            provider: 'custom',
            discriminator: '2222',
            username: 'ThisDiscordUser',
          },
        ],
      },
    },
  ],
  requestingMod: [
    {
      id: '5678',
      isCurrentUser: false,
      user: {
        displayName: 'OtherUser',
        linkedAccounts: [
          {
            provider: 'custom',
            discriminator: '2222',
            username: 'OtherDiscordUser',
          },
        ],
      },
    },
    {
      id: '9999',
      isCurrentUser: false,
      user: {
        displayName: 'OtherUser',
        linkedAccounts: [
          {
            provider: 'custom',
            discriminator: '3333',
            username: 'OtherUser',
          },
        ],
      },
    },
  ],
}
