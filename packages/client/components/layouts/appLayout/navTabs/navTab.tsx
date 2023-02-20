import React, { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'

import Link from 'next/link'
import { NavPath } from '@hooks/useNav'
import styles from './navTab.module.scss'
import classNames from 'classnames'
import { ActionNotif } from './actionNotif'
interface NavTabProps {
  title: string
  isActive: boolean
  href: string
  path?: NavPath
  badgeContent?: ReactNode | null
  notifContent?: ReactNode | null
  notifProgress?: number
  onClick?: (path?: NavPath) => void
}

export const NavTab: React.FC<NavTabProps> = ({
  title,
  href,
  isActive = false,
  path,
  badgeContent,
  notifProgress,
  notifContent,
  onClick,
}) => (
  <ActionNotif
    isActive={!isActive}
    progress={notifProgress}
    content={notifContent}
  >
    <Link passHref href={href}>
      <Box
        className={styles.navTab}
        data-active={isActive}
        data-cy="navTab"
        onClick={() => onClick?.(path)}
      >
        <Badge
          badgeContent={badgeContent}
          variant="dot"
          color="error"
          className={styles.badgeRoot}
          componentsProps={{ badge: { className: styles.badgeOffset } }}
          invisible={isActive || !badgeContent}
        >
          <Typography
            className={classNames(styles.title, { [styles.active]: isActive })}
          >
            {title.toUpperCase()}
          </Typography>
        </Badge>
      </Box>
    </Link>
  </ActionNotif>
)
