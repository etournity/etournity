import React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Link from 'next/link'
import { Icon } from '@components/ui/icon'
import styles from './bottomNav.module.scss'
import classNames from 'classnames'
import FeedIcon from '@mui/icons-material/Feed'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'

import { useNav, NavPath } from '@hooks/useNav'

interface BottomNavProps {
  className?: string
  isHidden?: boolean
}

export const BottomNav: React.FC<BottomNavProps> = ({
  className,
  isHidden,
}) => {
  const { path, activeMatch, activeTournament, userIsStaff } = useNav()
  return (
    <BottomNavigation
      value={path}
      className={classNames(className, styles.bottomNav, {
        [styles.hidden]: isHidden,
      })}
      data-cy="bottomNav"
    >
      <Link passHref href="/tournaments/">
        <BottomNavigationAction
          showLabel
          className={classNames(styles.bottomNavItem, {
            [styles.active]: path === NavPath.Tournaments,
          })}
          label="Tournaments"
          value={NavPath.Tournaments}
          icon={
            path === NavPath.Tournaments ? (
              <Icon variant="listFull" color={styles.muiPrimary} />
            ) : (
              <Icon variant="listHollow" />
            )
          }
          data-cy="bottomNavItem"
        />
      </Link>
      {activeTournament && (
        <Link passHref href={`/tournament/${activeTournament.id}`}>
          <BottomNavigationAction
            showLabel
            className={classNames(styles.bottomNavItem, {
              [styles.active]: path === NavPath.InfoPage,
            })}
            label="Info Page"
            value={NavPath.InfoPage}
            icon={
              path === NavPath.InfoPage ? <FeedIcon /> : <FeedOutlinedIcon />
            }
            data-cy="bottomNavItem"
          />
        </Link>
      )}
      {activeMatch && (
        <Link passHref href={`/lobby/${activeMatch.id}`}>
          <BottomNavigationAction
            showLabel
            className={classNames(styles.bottomNavItem, {
              [styles.active]: path === NavPath.MatchLobby,
            })}
            label="Match Lobby"
            value={NavPath.MatchLobby}
            icon={
              path === NavPath.MatchLobby ? (
                <SmartDisplayIcon />
              ) : (
                <Icon variant="playHollow" />
              )
            }
            data-cy="bottomNavItem"
          />
        </Link>
      )}
      {activeTournament && (
        <Link passHref href={`/tournament/${activeTournament.id}/brackets`}>
          <BottomNavigationAction
            showLabel
            className={classNames(styles.bottomNavItem, {
              [styles.active]: path === NavPath.Brackets,
            })}
            label="Brackets"
            value={NavPath.Brackets}
            icon={
              path === NavPath.Brackets ? (
                <Icon variant="bracketFull" color={styles.muiPrimary} />
              ) : (
                <Icon variant="bracketHollow" />
              )
            }
            data-cy="bottomNavItem"
          />
        </Link>
      )}
      {userIsStaff && (
        <Link passHref href={`/tournament/${activeTournament?.id}/hub`}>
          <BottomNavigationAction
            showLabel
            className={classNames(styles.bottomNavItem, {
              [styles.active]: path === NavPath.HostHub,
            })}
            label="Host Hub"
            value={NavPath.HostHub}
            icon={
              path === NavPath.HostHub ? (
                <Icon variant="dashboardFull" color={styles.muiPrimary} />
              ) : (
                <Icon variant="dashboardHollow" />
              )
            }
            data-cy="bottomNavItem"
          />
        </Link>
      )}
    </BottomNavigation>
  )
}
