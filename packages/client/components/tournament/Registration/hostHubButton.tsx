import React from 'react'
import { Button, ButtonProps, Typography } from '@mui/material'
import Link from 'next/link'
import styles from './hostHubButton.module.scss'
import { Loader } from '@components/ui/loader'

interface HostHubButtonProps extends ButtonProps {
  isStaff?: boolean
  requestingMod?: boolean
  deniedMod?: boolean
  tournamentId?: string
  hideButton?: boolean
  onRequest?: () => void
}

export const HostHubButton: React.FC<HostHubButtonProps> = ({
  isStaff,
  tournamentId,
  requestingMod,
  deniedMod,
  hideButton,
  onRequest,
  ...rest
}) => {
  if (!tournamentId || hideButton) return null

  if (deniedMod)
    return (
      <Button disabled className={styles.hostHubButton} {...rest}>
        <Typography variant="label">Denied</Typography>
      </Button>
    )
  if (isStaff)
    return (
      <Link passHref href={`/tournament/${tournamentId}/hub`}>
        <Button className={styles.hostHubButton} {...rest}>
          <Typography variant="label">Go to HostHub</Typography>
        </Button>
      </Link>
    )

  if (requestingMod)
    return (
      <Button
        disabled
        className={styles.hostHubButton}
        startIcon={<Loader color={styles.muiNeutral30} size={1} />}
        {...rest}
      >
        <Typography variant="label">Waiting</Typography>
      </Button>
    )

  return (
    <Button className={styles.hostHubButton} onClick={onRequest} {...rest}>
      <Typography variant="label">Apply as Mod</Typography>
    </Button>
  )
}
