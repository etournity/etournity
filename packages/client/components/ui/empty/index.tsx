import React, { ReactNode } from 'react'
import styles from './empty.module.scss'
import { Box, Typography } from '@mui/material'

export interface EmptyProps {
  children?: ReactNode
  description?: string
  title?: string
  icon?: ReactNode
  actions?: ReactNode | ReactNode[]
}

export const Empty: React.FC<EmptyProps> = ({
  children,
  description,
  title,
  icon,
  actions,
}) => (
  <Box className={styles.wrapper}>
    {icon}
    <Typography className={styles.title}>{title} </Typography>
    <Box className={styles.description}>
      {children ?? <Typography>{description}</Typography>}
    </Box>
    {actions && <Box className={styles.actions}>{actions}</Box>}
  </Box>
)
