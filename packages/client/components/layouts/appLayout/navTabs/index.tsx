import React, { useEffect, useState, ReactNode } from 'react'
import { NavTab } from './navTab'
import { useMatchActionNotif } from './actionNotif'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useNav, NavPath } from '@hooks/useNav'
import styles from './navTabs.module.scss'
import { useTickets } from '@hooks/useTickets'
import NotificationImportantOutlined from '@mui/icons-material/NotificationImportantOutlined'
import { authVar } from '@state/authVar'

export const NavTabs: React.FC = () => {
  const { path, activeMatch, activeTournament, userIsStaff } = useNav()
  const { notifContent, notifProgress } = useMatchActionNotif()
  const { tickets } = useTickets()
  const { userId } = authVar()

  const getIndicatorProps = () => {
    if (!document) return { width: 0, left: 0 }
    const tabsEl = document.getElementById('tabs')
    if (!tabsEl) return { width: 0, left: 0 }
    const tabsPos = tabsEl.getBoundingClientRect()
    const activeElPos = tabsEl
      .querySelector('div[data-active="true"')
      ?.getBoundingClientRect()

    if (!activeElPos) return { width: 0, left: 0 }
    return {
      left: activeElPos.left - tabsPos.left,
      width: activeElPos.width - 16,
    }
  }

  const [indicatorPos, setIndicatorPos] = useState<{
    width: number
    left: number
  }>({ width: 0, left: 0 })

  useEffect(() => {
    setIndicatorPos(getIndicatorProps())
    return () => {}
  }, [path, activeMatch, activeTournament, userIsStaff])

  const openTickets = (): ReactNode => {
    const openAmount = tickets.filter(
      (ticket) =>
        !ticket.resolved &&
        (ticket.assignee?.id === userId ||
          (ticket.assignee?.id === undefined &&
            ![ticket.reporter?.id, ticket.reported?.id].includes(userId)))
    ).length

    if (!openAmount) return null
    return (
      <Typography variant="label">
        <NotificationImportantOutlined
          sx={{ fontSize: '1rem', marginRight: '0.5rem' }}
        />
        {`${openAmount} open issue${openAmount > 1 ? 's' : ''}`}
      </Typography>
    )
  }

  return (
    <Box id="tabs" className={styles.navTabs} data-cy="navTabs">
      <NavTab
        key="tournaments"
        title="Tournaments"
        href="/tournaments"
        isActive={path === NavPath.Tournaments}
      />
      {(activeTournament || activeMatch || userIsStaff) && (
        <Box className={styles.divider} />
      )}
      {activeTournament && (
        <NavTab
          key="activeTournament"
          title={activeTournament.title ?? 'Info Page'}
          href={`/tournament/${activeTournament.id}`}
          isActive={path === NavPath.InfoPage}
        />
      )}
      {activeMatch && (
        <NavTab
          key="lobby"
          title="Match Lobby"
          href={`/lobby/${activeMatch.id}`}
          isActive={path === NavPath.MatchLobby}
          notifContent={notifContent}
          notifProgress={notifProgress}
        />
      )}
      {activeTournament && (
        <NavTab
          key="brackets"
          title="Brackets"
          href={`/tournament/${activeTournament.id}/brackets`}
          isActive={path === NavPath.Brackets}
        />
      )}
      {userIsStaff && (
        <NavTab
          key="hub"
          title="Host Hub"
          href={`/tournament/${activeTournament?.id}/hub`}
          isActive={path === NavPath.HostHub}
          notifContent={openTickets()}
        />
      )}
      <Box
        className={styles.activeIndicator}
        sx={{
          width: indicatorPos.width,
          left: indicatorPos.left,
        }}
      />
    </Box>
  )
}
