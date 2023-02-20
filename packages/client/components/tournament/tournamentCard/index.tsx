import {
  Round,
  Game,
  Tournament,
  GameMode,
  StageType,
} from '@generated/graphql'
import React from 'react'
import styles from './tournamentCard.module.scss'
import Link from 'next/link'
import { Except } from 'type-fest'
import { Avatar, Box, Chip, Paper, Typography } from '@mui/material'
import { Icon } from '@components/ui/icon'

import DnsOutlined from '@mui/icons-material/DnsOutlined'
import DevicesOutlined from '@mui/icons-material/DevicesOutlined'
import GamepadOutlined from '@mui/icons-material/GamepadOutlined'
import LanguageOutlined from '@mui/icons-material/LanguageOutlined'
import PeopleOutlined from '@mui/icons-material/PeopleOutlined'
import { TournamentStatusChip } from '../tournamentHeader/tournamentStatusChip'
import { InfoTag } from './infoTag'
import { RoleInfo } from './roleInfo'
import dayjs from 'dayjs'
export interface TournamentCardProps {
  tournament: TournamentCardInput
  toHub?: boolean
  backgroundSrc?: string
}

export interface TournamentCardInput
  extends Except<
    Tournament,
    | 'activeRound'
    | 'game'
    | 'gameMode'
    | 'hostUser'
    | 'createdAt'
    | 'noShow'
    | 'gameId'
    | 'gameModeId'
    | 'participants'
    | 'rules'
    | 'tickets'
    | 'updatedAt'
    | 'language'
    | 'platforms'
    | 'region'
    | 'stages'
  > {
  game: Pick<Game, 'title'>
  gameMode: Pick<GameMode, 'name'>
  hostUser: {
    id: string
    displayName: string
    linkedAccounts: Array<{
      id: string
      avatar?: string | null | undefined
    }>
  }
  activeRound?: Pick<Round, 'id'> | undefined | null
  language?:
    | {
        name: string
      }
    | null
    | undefined
  platforms: Array<{
    name: string
  }>
  region?:
    | {
        name: string
      }
    | null
    | undefined

  stages: Array<{
    type: StageType
  }>
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  toHub,
  backgroundSrc,
  ...rest
}) => (
  <Link passHref href={`/tournament/${tournament.id}${toHub ? '/hub' : ''}`}>
    <Box className={styles.card} {...rest}>
      <Paper className={styles.cardContent}>
        <Box className={styles.picture}>
          <TournamentStatusChip
            tournamentStatus={tournament.status}
            checkinStart={tournament.checkinStart}
            checkinEnd={tournament.checkinEnd}
            startDate={tournament.date}
            className={styles.statusChip}
          />
          <Chip
            label={dayjs(tournament.date).format('HH:mm DD/MM/YYYY')}
            variant="outlined"
            className={styles.dateChip}
          />
          <Box
            sx={{
              background: `no-repeat center / cover url("${backgroundSrc}")`,
              height: 180,
              borderRadius: 'inherit',
            }}
          />
        </Box>
        <Box className={styles.info}>
          <Box className={styles.infoGrid}>
            <InfoTag
              icon={<PeopleOutlined className={styles.infoIcon} />}
              content={`${tournament.playersCount}/${tournament.maxPlayers} Payers`}
            />
            <InfoTag
              icon={<GamepadOutlined className={styles.infoIcon} />}
              content={`${tournament.game.title} - ${tournament.gameMode?.name}`}
            />
            <InfoTag
              icon={<DnsOutlined className={styles.infoIcon} />}
              content={tournament.region?.name}
            />
            <InfoTag
              icon={
                <Icon
                  variant="bracketHollow"
                  className={styles.infoIcon}
                  color={styles.muiOnSurfaceVariant}
                />
              }
              content={
                tournament.stages?.[0]?.type === 'SINGLE' &&
                'Single Elimination'
              }
            />
            <InfoTag
              icon={<DevicesOutlined className={styles.infoIcon} />}
              content={tournament?.platforms
                ?.map((platform) => platform?.name)
                .join(', ')}
            />
            <InfoTag
              icon={<LanguageOutlined className={styles.infoIcon} />}
              content={tournament.language?.name}
            />
          </Box>
          <Box className={styles.titleAndHost}>
            <Avatar
              alt="Organizer Profile Picture"
              src={
                tournament?.hostUser?.linkedAccounts?.[0]?.avatar ?? undefined
              }
              className={styles.avatar}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="bodyMedium" sx={{ fontWeight: 700 }}>
                {tournament.title}
              </Typography>

              <Typography variant="labelSmall" className={styles.host}>
                {tournament.hostUser.displayName}
              </Typography>
            </Box>
          </Box>
          <RoleInfo
            className={styles.rolesInfo}
            userRoles={tournament.userRoles}
          />
        </Box>
      </Paper>
    </Box>
  </Link>
)
