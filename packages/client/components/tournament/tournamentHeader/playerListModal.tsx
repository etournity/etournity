import React from 'react'
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Typography,
  Avatar,
  Button,
} from '@mui/material'
import { Participant, ParticipantRoleType } from '@generated/graphql'
import {
  MuiModal,
  MuiModalActions,
  MuiModalProps,
} from '@components/ui/muiModal'
import styles from './playerListModal.module.scss'
import classNames from 'classnames'
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined'

interface PlayerListModalProps extends MuiModalProps {
  participants: Participant[] | undefined
  gameId: string | undefined
}
export const PlayerListModal: React.FC<PlayerListModalProps> = ({
  participants,
  gameId,
  onClose,
  ...rest
}) => {
  const players = participants?.filter((p) =>
    p.roles.find(({ type }) => type === ParticipantRoleType.Player)
  )

  const getGameUser = (participant: Participant, gameId: string | undefined) =>
    participant.user.gameUsers.find((gameUser) => gameUser.gameId === gameId)

  const getPlayerAvatar = (participant: Participant) =>
    participant.user.linkedAccounts?.[0].avatar ?? undefined

  return (
    <MuiModal
      title="Player List"
      icon={<PeopleAltOutlined />}
      className={classNames(styles.modal, rest.className)}
      onClose={onClose}
      {...rest}
    >
      <TableContainer sx={{ maxHeight: 480, height: '50vh' }}>
        <Table stickyHeader className={styles.table}>
          <TableHead className={styles.head}>
            <TableRow className={styles.headRow}>
              <TableCell>
                <Typography variant="label">Seed</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="label" sx={{ marginLeft: '2.75rem' }}>
                  Player Info
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="label">Elo</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.body}>
            {players?.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <Typography className={styles.seed}>
                    {player.team?.seed ?? '?'}
                  </Typography>{' '}
                </TableCell>
                <TableCell className={styles.playerInfo}>
                  <Avatar
                    src={getPlayerAvatar(player)}
                    sx={{ width: 32, height: 32, marginRight: '0.75rem' }}
                  />
                  <Typography>
                    {getGameUser(player, gameId)?.inGameName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{getGameUser(player, gameId)?.elo}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MuiModalActions>
        <Button onClick={() => onClose?.({}, 'backdropClick')}>Close</Button>
      </MuiModalActions>
    </MuiModal>
  )
}
