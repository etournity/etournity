import { User } from '@prisma/client'
import { roles, defaultRole, defaultUserRole } from './roles'

/**
 * GetPermissions finds all applicable permissions for a specific role
 */
export const getPermissions = (roleName: string): string[] => {
  const role = roles.find((role) => role.name === roleName)

  if (!role) return []

  return [
    ...role.permissions,
    ...((role.parent && getPermissions(role.parent)) || []),
  ]
}

/**
 * HasPermissions checks if a user has specific permissions or role with said permissions.
 * @example
 * hasPermissions(user, ['tournament.create', 'tournament.join'])
 * @example
 * hasPermissions(user, 'tournament.create')
 */
export const hasPermissions = (
  user: User | null,
  ...permissions: string[] | string[][]
): boolean => {
  let userPerms: string[] = [
    ...getPermissions(defaultRole),
    ...((user !== null && getPermissions(defaultUserRole)) || []),
  ]
  if (user)
    userPerms = [
      ...userPerms,
      ...user.roles.map((role) => getPermissions(role)).flat(),
      ...user.permissions,
    ]

  return permissions.flat().some((perm) => userPerms.includes(perm))
}
