interface Role {
  name: string
  permissions: string[]
  staff?: boolean
  parent?: string
}

export const roles: Role[] = [
  {
    name: 'admin',
    staff: true,
    parent: 'moderator',
    permissions: ['match.admin', 'admin.users.update'],
  },
  {
    name: 'moderator',
    staff: true,
    parent: 'organizer',
    permissions: ['game.create'],
  },
  {
    name: 'organizer',
    parent: 'user',
    permissions: [
      'tournament.create',
      'match.opponent.remove',
      'match.opponent.add',
      'match.create',
      'ticket.view',
    ],
  },
  {
    name: 'user',
    parent: 'guest',
    permissions: [
      'tournament.join',
      'tournament.signup',
      'team.create',
      'match.readycheck.create',
      'match.status.update',
      'gameuser.create',
    ],
  },

  // Note: this is the default role, everyone using the platform (even when not logged in)
  // has access to these permissions
  {
    name: 'guest',
    permissions: ['tournament.view'],
  },
]

export const defaultRole = 'guest'
export const defaultUserRole = 'user'
