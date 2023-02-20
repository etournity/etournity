import { Box, Skeleton } from '@mui/material'
import React from 'react'
import styles from './infoPage.module.scss'

import { Tournament, TournamentStatus } from '@generated/graphql'
import { useRouter } from 'next/router'

import { CollapsableCard } from '@components/ui/collapsableCard'
import { TournamentSchedule } from '@components/tournament/TournamentSchedule'
import { TournamentInfo } from '@components/tournament/tournamentInfo'
import classNames from 'classnames'
import { useWindowSize } from '@hooks/useWindowSize'
import { useTournamentInfo } from '@hooks/useTournamentInfo'
import { TournamentHeader } from '@components/tournament/tournamentHeader'
import { Registration } from '@components/tournament/Registration'
import { filterXSS } from 'xss'
import { ErrorResult } from '@components/results/errorResult'
import Link from 'next/link'
import Button from '@mui/material/Button'
const TournamentInfoPage = () => {
  const router = useRouter()
  const tournamentId = (router.query.tournamentId as string) || ''

  const {
    tournament,
    userIsRegistered,
    userIsStaff,
    bracketsReady,
    currentParticipant,
  } = useTournamentInfo(tournamentId)

  const { isMobile } = useWindowSize()

  const responsivePadding = {
    xs: '1rem',
    sm: '1.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  }

  if (
    tournament?.status === TournamentStatus.Draft &&
    !currentParticipant?.isHost
  )
    return (
      <ErrorResult
        hideReportButton
        title="Page not available yet"
        description="Page will be available when the tournament is published"
        customActions={[
          <Link key="discovery" passHref href="/tournaments">
            <Button variant="contained">Back to Tournaments</Button>
          </Link>,
        ]}
      />
    )
  return (
    <Box
      className={classNames(styles.infoPage, { [styles.isMobile]: isMobile })}
      data-cy="infopage"
    >
      <Box className={styles.bannerContainer}>
        <Box
          className={styles.banner}
          component="img"
          src="/assets/images/thisIsABanner.png"
          alt="tournamentBanner"
          sx={{
            maxHeight: { xs: 194, sm: 282, md: 425, lg: 378, xl: 'inherit' },
            maxWidth: { xs: 600, sm: 905, md: 1240, lg: 1440, xl: '100vw' },
          }}
        />
      </Box>
      <Box className={styles.body}>
        <Box
          className={styles.upperBody}
          sx={{ justifyContent: { xs: 'center', sm: 'space-between' } }}
        >
          <TournamentHeader tournament={tournament} />

          <Registration
            tournament={tournament}
            currentParticipant={currentParticipant}
            bracketsReady={bracketsReady}
            userIsRegistered={userIsRegistered}
            userIsStaff={userIsStaff}
            isMobile={isMobile}
          />
        </Box>
        <Box
          className={classNames(styles.lowerBody, {
            [styles.mobile]: isMobile,
          })}
        >
          <TournamentInfo
            tournament={tournament}
            sx={{
              order: 2,
              padding: responsivePadding,
            }}
          />
          <CollapsableCard
            title="RULES"
            sx={{
              order: 3,
              padding: responsivePadding,
            }}
          >
            {tournament?.rules ? (
              <Box
                dangerouslySetInnerHTML={{
                  __html: filterXSS(tournament?.rules ?? ''),
                }}
              />
            ) : (
              <Box>
                <Skeleton />
                <Skeleton width="80%" />
              </Box>
            )}
          </CollapsableCard>
          <TournamentSchedule
            bracketsReady={bracketsReady}
            tournament={tournament as Tournament}
            sx={{ order: 1 }}
          />
          <CollapsableCard
            title="DESCRIPTION"
            sx={{
              order: 4,
              padding: responsivePadding,
            }}
          >
            {tournament?.description ? (
              <Box
                dangerouslySetInnerHTML={{
                  __html: filterXSS(tournament?.description ?? ''),
                }}
              />
            ) : (
              <Box>
                <Skeleton />
                <Skeleton width="80%" />
              </Box>
            )}
          </CollapsableCard>
        </Box>
      </Box>
    </Box>
  )
}

export default TournamentInfoPage
