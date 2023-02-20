import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Avatar,
  SxProps,
  Skeleton,
} from '@mui/material'
import { BracketIcon, DiscordIcon } from '@public/assets/icons/customIconLib'
import LanguageIcon from '@mui/icons-material/Language'
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined'
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'

import { Tournament } from '@generated/graphql'
import Link from 'next/link'
import styles from './tournamentInfo.module.scss'
import { GamepadOutlined, LiveTvOutlined } from '@mui/icons-material'
import classNames from 'classnames'

interface TournamentInfoProps {
  tournament?: Tournament
  className?: string
  sx?: SxProps
}

export const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournament,
  className,
  sx,
}) => {
  const skeletonWidth = 80

  const discordLink =
    tournament?.discordLink ?? tournament?.supportLink ?? undefined

  const platforms = tournament?.platforms
    ?.map((platform) => platform?.name)
    .join(', ')

  const allPlatforms =
    platforms?.includes('PC') &&
    platforms?.includes('Mobile') &&
    platforms?.includes('PlayStation') &&
    platforms?.includes('Switch') &&
    platforms?.includes('XBOX')

  return (
    <Paper className={classNames(styles.info, className)} sx={sx} elevation={0}>
      <Typography variant="title" className={styles.title}>
        INFO
      </Typography>
      <Box className={styles.infoBody}>
        <Box className={styles.infoWrapper}>
          <Box>
            <GamepadOutlined />
            <Typography variant="label">
              {tournament ? (
                `${tournament?.game?.title} - ${tournament?.gameMode?.name}`
              ) : (
                <Skeleton width={skeletonWidth} />
              )}
            </Typography>
          </Box>
          <Box sx={{ py: '0.5rem' }}>
            <BracketIcon />
            <Typography variant="label">
              {tournament?.stages?.[0]?.type.replaceAll(
                'SINGLE',
                'Single Elimination'
              ) ?? <Skeleton width={skeletonWidth} />}
            </Typography>
          </Box>
          <Box>
            <LanguageIcon />
            <Typography variant="label">
              {tournament ? (
                tournament?.language?.name
              ) : (
                <Skeleton width={skeletonWidth} />
              )}
            </Typography>
          </Box>
        </Box>
        <Box className={styles.infoWrapper}>
          <Box>
            <DnsOutlinedIcon />
            <Typography variant="label">
              {tournament ? (
                tournament.region?.name
              ) : (
                <Skeleton width={skeletonWidth} />
              )}
            </Typography>
          </Box>
          <Box sx={{ py: '0.5rem' }}>
            <DevicesOutlinedIcon />
            <Typography variant="label">
              {(allPlatforms ? 'All Platforms' : platforms) ?? (
                <Skeleton width={skeletonWidth} />
              )}
            </Typography>
          </Box>
          <Box>
            <EmojiEventsOutlinedIcon />
            <Typography variant="label">
              {tournament ? (
                (tournament?.prizePool?.length ?? 0) > 0 ? (
                  tournament?.prizePool
                ) : (
                  'No Prize'
                )
              ) : (
                <Skeleton width={skeletonWidth} />
              )}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="title" className={styles.title}>
        LINKS
      </Typography>
      {(discordLink || tournament?.streamLink) && (
        <Box className={styles.links}>
          {discordLink && (
            <Box
              className={styles.link}
              component="a"
              href={discordLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              <DiscordIcon />
              <Typography variant="label">
                {discordLink.substring(discordLink.search(/:\/\//) + 3)}
              </Typography>
            </Box>
          )}
          {tournament?.streamLink && (
            <Link passHref href={tournament?.streamLink}>
              <Box
                className={styles.link}
                component="a"
                href={tournament?.streamLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                <LiveTvOutlined />
                <Typography variant="label">
                  {tournament?.streamLink.substring(
                    tournament?.streamLink.search(/:\/\//) + 3
                  )}
                </Typography>
              </Box>
            </Link>
          )}
        </Box>
      )}

      <Typography variant="title" className={styles.title}>
        ORGANIZED BY
      </Typography>
      <Box className={styles.organizer}>
        {tournament ? (
          <Avatar
            alt="Organizer Profile Picture"
            src={tournament?.hostUser?.linkedAccounts[0].avatar ?? undefined}
            className={styles.avatar}
          />
        ) : (
          <Skeleton variant="circular" className={styles.avatar}>
            <Avatar />
          </Skeleton>
        )}
        <Typography variant="title">
          {tournament?.hostUser?.displayName ?? (
            <Skeleton width={skeletonWidth * 2} />
          )}
        </Typography>
      </Box>
    </Paper>
  )
}
