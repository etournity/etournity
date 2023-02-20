import React from 'react'
import Link from 'next/link'
import { UserBar } from '../userBar'
import styles from './header.module.scss'
import Box from '@mui/material/Box'
import { NavTabs } from '../navTabs'
import { useWindowSize } from '@hooks/useWindowSize'
import { Chat } from '../chat'
import { useNav, NavPath } from '@hooks/useNav'
import { TournamentSearch } from '@components/tournament/tournamentSearch'

export const Header: React.FC = () => {
  const { isMobile } = useWindowSize()
  const { path } = useNav()

  return (
    <Box className={styles.header} data-cy="header">
      <Box className={styles.left}>
        <Link href="/">
          <a className={styles.home}>
            <img
              draggable={false}
              height={40}
              src="/assets/logo/alphaLogo.svg"
            />
          </a>
        </Link>
        {isMobile && process.env.ETY_ENV !== 'production' ? (
          path === NavPath.Tournaments && (
            <TournamentSearch sx={{ marginLeft: '1rem' }} />
          )
        ) : (
          <NavTabs />
        )}
      </Box>
      <Box className={styles.right}>
        <Chat />
        <UserBar />
      </Box>
    </Box>
  )
}
