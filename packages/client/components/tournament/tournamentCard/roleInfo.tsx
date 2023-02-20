import React from 'react'
import { ParticipantRoleType } from '@generated/graphql'
import Shield from '@mui/icons-material/Shield'
import SportsEsports from '@mui/icons-material/SportsEsports'
import Gavel from '@mui/icons-material/Gavel'
import { Box, Tooltip } from '@mui/material'

interface RoleInfoProps {
  userRoles: ParticipantRoleType[] | null | undefined
  className?: string
}

export const RoleInfo: React.FC<RoleInfoProps> = ({ userRoles, className }) => {
  if (!userRoles?.length) return null

  const isPlayer = userRoles.includes(ParticipantRoleType.Player)
  const isStaff =
    userRoles.includes(ParticipantRoleType.Host) ||
    userRoles.includes(ParticipantRoleType.Moderator)
  const isAdmin = userRoles.includes(ParticipantRoleType.Admin)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} className={className}>
      {isAdmin && (
        <Tooltip title="Admin">
          <Shield color="primary" />
        </Tooltip>
      )}
      {isStaff && (
        <Tooltip title="Staff">
          <Gavel color="primary" />
        </Tooltip>
      )}
      {isPlayer && (
        <Tooltip title="Player">
          <SportsEsports color="primary" />
        </Tooltip>
      )}
    </Box>
  )
}
