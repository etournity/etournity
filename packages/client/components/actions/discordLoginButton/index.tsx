import React, { useState, useEffect } from 'react'
import styles from './discordLoginButton.module.scss'
import { Button, Typography, ButtonProps } from '@mui/material'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { DiscordIcon } from '@public/assets/icons/customIconLib'

export const DiscordLoginButton: React.FC<ButtonProps> = ({
  className,
  ...rest
}) => {
  const router = useRouter()
  const [returnTo, setReturnTo] = useState<string | undefined>(undefined)

  useEffect(() => {
    setReturnTo(window.location.origin + router.asPath)
  }, [router])

  return (
    <Button
      variant="contained"
      className={classNames(styles.discordButton, className)}
      href={`${
        process.env.GRAPHQL_SERVER_URL ?? ''
      }/auth/discord?returnTo=${returnTo}`}
      startIcon={<DiscordIcon />}
      {...rest}
    >
      <Typography variant="labelLarge">Sign-in via Discord</Typography>
    </Button>
  )
}
