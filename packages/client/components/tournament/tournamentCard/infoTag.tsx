import React from 'react'
import { Paper, Typography } from '@mui/material'
import styles from './tournamentCard.module.scss'
import { useWindowSize } from '@hooks/useWindowSize'

interface InfoTagProps {
  icon: React.ReactNode
  content?: React.ReactNode
}
export const InfoTag: React.FC<InfoTagProps> = ({
  icon,
  content,
  children,
}) => {
  const { isMobile } = useWindowSize()

  return (
    <Paper className={styles.infoPaper}>
      {icon}
      <Typography
        variant={isMobile ? 'labelSmall' : 'labelMedium'}
        className={styles.infoLabel}
      >
        {content ?? children}
      </Typography>
    </Paper>
  )
}
