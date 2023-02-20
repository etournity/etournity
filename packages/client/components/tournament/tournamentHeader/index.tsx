import React, { useState } from 'react'
import { Box, Typography, Chip, Skeleton } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import { Tournament } from '@generated/graphql'
import styles from './tournamentHeader.module.scss'
import { TournamentStatusChip } from './tournamentStatusChip'
import dayjs from 'dayjs'
import { PlayerListModal } from './playerListModal'
interface TournamentHeaderProps {
  tournament: Tournament | undefined
}
export const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  tournament,
}) => {
  const [playerListOpen, setPlayerListOpen] = useState(false)
  const players = tournament?.participants?.filter((p) => p.isPlayer) ?? []

  const checkinEnded = dayjs().isAfter(tournament?.checkinEnd)

  return (
    <Box
      className={styles.header}
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start', md: 'center' },
      }}
    >
      <Box
        sx={{
          width: { xs: 52, xl: 72 },
          height: { xs: 52, xl: 72 },
          mr: { xs: 0, sm: 0, md: '1.31rem', lg: '0.5rem', xl: '1.5rem' },
        }}
      >
        <img className={styles.image} src="/assets/logo/brawlhallaLogo.svg" />
      </Box>
      <Box>
        <Typography variant="headline">
          {tournament?.title || <Skeleton width={200} />}
        </Typography>
        {tournament ? (
          <Box
            className={styles.chipBox}
            sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
          >
            <TournamentStatusChip
              tournamentStatus={tournament.status}
              checkinStart={tournament.checkinStart}
              checkinEnd={tournament.checkinEnd}
              startDate={tournament.date}
            />
            {tournament.streamLink && (
              <Chip
                clickable
                component="a"
                href={tournament.streamLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.streamChip}
                variant="outlined"
                icon={<LiveTvIcon />}
              />
            )}

            <Chip
              clickable
              variant="filled"
              label={
                checkinEnded
                  ? players.length
                  : `${players.length} / ${tournament.maxPlayers}`
              }
              icon={<PeopleAltOutlinedIcon />}
              onClick={() => setPlayerListOpen(true)}
            />
          </Box>
        ) : (
          <Skeleton width={150} />
        )}
      </Box>
      <PlayerListModal
        open={playerListOpen}
        participants={tournament?.participants}
        gameId={tournament?.game.id}
        onClose={() => setPlayerListOpen(false)}
      />
    </Box>
  )
}
