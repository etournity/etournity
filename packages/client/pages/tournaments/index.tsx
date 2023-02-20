import React, { useState } from 'react'
import { TournamentCard } from '../../components/tournament/tournamentCard'
import styles from './index.module.scss'
import { ParticipantRoleType, useGetTournamentsQuery } from '@generated/graphql'
import { useAuth } from '@hooks/useAuth'
import { Loader } from '@components/ui/loader'
import { handleError } from '@handlers/errorHandler'
import { Box, Button, Paper, Tab, Tabs, Fab } from '@mui/material'
import { TournamentSearch } from '@components/tournament/tournamentSearch'
import { AddRounded } from '@mui/icons-material'
import { useWindowSize } from '@hooks/useWindowSize'

const Index: React.FC = () => {
  const auth = useAuth()
  const user = auth?.user
  const { breakpoint, isMobile } = useWindowSize()
  const [currentTab, setCurrentTab] = useState(1)

  const {
    data: tournamentsData,
    loading: tournamentsLoading,
  } = useGetTournamentsQuery({
    onError: (error) => handleError(error),
  })
  const {
    data: participatingData,
    loading: participatingLoading,
  } = useGetTournamentsQuery({
    variables: {
      userHasParticipantRoles: [
        ParticipantRoleType.Host,
        ParticipantRoleType.Admin,
        ParticipantRoleType.Player,
        ParticipantRoleType.Moderator,
      ],
    },
    onError: (error) => handleError(error),
  })
  if (tournamentsLoading || participatingLoading) return <Loader />

  const getTournaments = (participating?: boolean) => {
    const tournaments = participating
      ? participatingData?.tournaments
      : tournamentsData?.tournaments

    if (!tournaments?.length) return null

    return tournaments?.map((element) => {
      if (!element) return null
      return (
        <TournamentCard
          key={element.id}
          tournament={element}
          backgroundSrc="/assets/images/thisIsABanner.png"
          toHub={element.hostUser.id === user?.id}
          data-cy="tournamentCard"
        />
      )
    })
  }

  const showParticipatingTournaments = getTournaments(true)
  const showTournaments = getTournaments()

  return (
    <Box className={styles.discovery}>
      {!isMobile &&
        breakpoint !== 'lg' &&
        process.env.ETY_ENV !== 'production' && (
          <Box className={styles.searchAndFilter}>
            <Paper className={styles.search}>
              <TournamentSearch />
            </Paper>

            <Paper className={styles.filter}>
              {'Filters (Coming Soon) \u2122'}
            </Paper>
          </Box>
        )}
      <Box className={styles.tournamentLists}>
        {breakpoint === 'lg' && process.env.ETY_ENV !== 'production' && (
          <Paper className={styles.search}>
            <TournamentSearch />
          </Paper>
        )}
        <Box className={styles.navigation}>
          <Paper
            sx={{
              flex: '2',
              borderRadius: '0.75rem',
            }}
          >
            <Tabs
              centered
              value={currentTab}
              onChange={(_, value) => setCurrentTab(value)}
            >
              <Tab label="All Tournaments" value={1} />
              <Tab label="My Tournaments" value={2} data-cy="userTournaments" />
            </Tabs>
          </Paper>

          {!isMobile && (
            <Paper className={styles.create}>
              <Button href="/tournament/new" startIcon={<AddRounded />}>
                Create Tournament
              </Button>
            </Paper>
          )}
        </Box>

        <Box className={styles.tournamentList}>
          {currentTab === 1 ? showTournaments : showParticipatingTournaments}
        </Box>
      </Box>
      {isMobile && (
        <Fab
          variant="extended"
          aria-label="Create"
          color="primary"
          className={styles.createFab}
          href="/tournament/new"
        >
          <AddRounded />
          Create
        </Fab>
      )}
    </Box>
  )
}

export default Index
