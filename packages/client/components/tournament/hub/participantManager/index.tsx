import React, { useState } from 'react'
import { Avatar } from '@components/ui/avatar'
import { FloatingActionMenu } from '@components/ui/fam'
import { Icon } from '@components/ui/icon'
import { SearchBar } from '@components/ui/searchBar'
import { Table, TableItem, HeaderItemProps } from '@components/ui/table'
import { Tabs, Tab } from '@components/ui/tabs'
import {
  Participant,
  ParticipantRoleType,
  useKickParticipantMutation,
  useUpdateGameUserEloMutation,
  useUpdateParticipantRolesMutation,
} from '@generated/graphql'
import styles from './participantManager.module.scss'
import { PartialDeep } from 'type-fest'
import Fuse from 'fuse.js'
import { StaffManager } from '../staffManager'
import classNames from 'classnames'
import { useAuth } from '@hooks/useAuth'
import { Empty } from '@components/ui/empty'
import { Tooltip } from '@components/ui/tooltip'

export interface ParticipantManagerProps {
  participants?: Array<PartialDeep<Participant>>
  showSeed?: boolean
  loading?: boolean
  tournamentId?: string
}
export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  participants = [],
  showSeed = false,
  loading,
  tournamentId = '',
}) => {
  const user = useAuth()?.user
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [updateElo] = useUpdateGameUserEloMutation({
    onError: console.error,
  })

  const [updateRoles] = useUpdateParticipantRolesMutation({
    onError: console.error,
  })

  const [kickParticipant] = useKickParticipantMutation({
    onError: console.error,
  })

  const fuse = new Fuse(participants, {
    includeScore: true,
    threshold: 0.6,
    keys: ['user.linkedAccounts.username', 'user.gameUsers.inGameName'],
  })

  const filteredParticipants =
    searchTerm.length > 0
      ? fuse.search(searchTerm?.toString()).map((result) => result.item)
      : participants

  const tableHeaders: HeaderItemProps[] = [
    {
      key: 'seed',
      label: showSeed ? 'Seed' : 'Check-In',
      sortable: showSeed,
      width: 5,
      currentOrder: showSeed ? 'ASC' : 'NONE',
    },
    { key: 'discord', label: 'Discord Info.', sortable: true, width: 10 },
    {
      key: 'playerName',
      label: 'Player Name',
      sortable: true,
      width: 8,
    },
    { key: 'elo', label: 'Elo', sortable: true, width: 3 },
    { key: 'action', label: '', width: 2 },
  ]

  const playerCount = participants.filter((p) =>
    p.roles?.filter((r) => r?.type === ParticipantRoleType.Player)
  ).length

  const players = filteredParticipants.filter(
    (participant) =>
      !participant.kicked &&
      participant.roles?.filter(
        (role) => role?.type === ParticipantRoleType.Player
      ).length !== 0
  )

  const staffList = filteredParticipants.filter(
    (participant) =>
      participant.roles?.filter(
        (role) =>
          role?.type === ParticipantRoleType.Host ||
          role?.type === ParticipantRoleType.Admin ||
          role?.type === ParticipantRoleType.Moderator
      ).length !== 0
  )
  const playerData = [...players]
    ?.sort((a, b) => (a.team?.seed ?? 999) - (b.team?.seed ?? 999))
    ?.map((player, i) => ({
      seed: showSeed ? (
        <Tooltip
          key={player?.team?.seed}
          className={styles.seed}
          content="Missed Check-In!"
          placement="right"
          disabled={player?.team?.seed !== null}
        >
          {player?.team?.seed ? (
            <span>{player?.team?.seed}</span>
          ) : (
            <div key="NoSeed" className={styles.statusIcon}>
              -
            </div>
          )}
        </Tooltip>
      ) : (
        <div key="NoSeed" className={styles.statusIcon}>
          {player.isCheckedIn ? <Icon variant="tick" size={1} /> : '?'}
        </div>
      ),
      discord: (
        <div
          key={player?.user?.linkedAccounts?.[0]?.username}
          className={styles.discord}
        >
          <Avatar size={2} userAccount={player?.user?.linkedAccounts?.[0]} />
          <div className={styles.discordInfo}>
            <span className={styles.discordName}>
              {player?.user?.linkedAccounts?.[0]?.username}
            </span>
            <span>#{player?.user?.linkedAccounts?.[0]?.discriminator}</span>
          </div>
        </div>
      ),
      playerName: (
        <span
          key={player?.user?.gameUsers?.[0]?.inGameName ?? ''}
          className={styles.playerName}
        >
          {player?.user?.gameUsers?.[0]?.inGameName ?? ''}
        </span>
      ),
      elo: (
        <input
          key={player.user?.gameUsers?.[0]?.elo}
          id={`${player.id}elo`}
          className={styles.input}
          type="number"
          size={4}
          defaultValue={player?.user?.gameUsers?.[0]?.elo}
          onBlur={(e) => {
            const value = e.target.valueAsNumber
            if (
              ((value <= 9999 && value > 0) || isNaN(value)) &&
              player?.user?.gameUsers?.[0]?.id &&
              player?.user?.gameUsers?.[0]?.elo !== value
            )
              updateElo({
                variables: {
                  id: player?.user?.gameUsers?.[0]?.id,
                  elo: value,
                  tournamentId,
                },
              })
          }}
        />
      ),
      action: (
        <FloatingActionMenu
          key={player.id}
          className={styles.playerMenu}
          giveWay={i === 0 ? 'top' : undefined}
        >
          <div
            key="editElo"
            className={styles.playerOption}
            onClick={() => document.getElementById(`${player.id}elo`)?.focus()}
          >
            <Icon variant="gear" size={1} />
            EDIT ELO
          </div>
          {player.roles?.find((role) =>
            role?.type
              ? role.type !== ParticipantRoleType.Moderator &&
                [ParticipantRoleType.Host, ParticipantRoleType.Admin].includes(
                  role.type
                )
              : false
          ) ? null : (
            <div
              key="makeMod"
              className={styles.playerOption}
              onClick={() =>
                updateRoles({
                  variables: {
                    participantId: player.id ?? '',
                    addRoles: [ParticipantRoleType.Moderator],
                  },
                })
              }
            >
              <Icon variant="plus" size={1} />
              MAKE MODERATOR
            </div>
          )}
          <div
            key="kick"
            className={classNames(styles.playerOption, styles.red)}
            onClick={() =>
              kickParticipant({
                variables: {
                  participantId: player.id ?? '',
                },
              })
            }
          >
            <Icon variant="boot" size={1} />
            KICK PLAYER
          </div>
        </FloatingActionMenu>
      ),
    }))

  return (
    <Tabs
      extra={(i) => (
        <SearchBar
          className={styles.searchBar}
          placeholder={`Search for ${i === 0 ? 'Player' : i === 1 && 'Mod'}`}
          onChange={(value) => setSearchTerm(value)}
        />
      )}
      className={styles.tabs}
    >
      <Tab header="Players" badge={players.length ?? 0}>
        <Table
          headers={tableHeaders}
          loading={loading}
          maxHeight="29rem"
          emptyPlaceholder={
            <div className={styles.empty}>
              <Empty
                noTitle
                description={
                  playerCount === 0 ? 'No Players Yet' : 'No Results'
                }
              />
            </div>
          }
        >
          {playerData?.map((player, index) => (
            <TableItem
              key={player.discord.key}
              slim
              className={styles.player}
              itemData={playerData[index]}
            />
          ))}
        </Table>
      </Tab>
      <Tab header="Staff" badge={staffList.length ?? 0}>
        <StaffManager
          hasAddPermission={
            participants.find(
              (participant) => user?.id === participant?.user?.id
            )?.isHost ?? false
          }
          staffList={staffList}
          requestingMod={participants.filter(
            (participant) => participant.requestingMod === true
          )}
          className={styles.staffManager}
          hasPermissionToKick={() =>
            staffList
              .filter((staff) =>
                staff.roles?.find(
                  (role) =>
                    role?.type === ParticipantRoleType.Host ||
                    role?.type === ParticipantRoleType.Admin
                )
              )
              .some((staff) => staff.user?.id === user?.id)
          }
          onAdd={(player) =>
            updateRoles({
              variables: {
                participantId: player.id ?? '',
                addRoles: [ParticipantRoleType.Moderator],
              },
            })
          }
          onDeny={(player) => {
            updateRoles({
              variables: { participantId: player.id ?? '', deniedMod: true },
            })
          }}
          onKick={(staff) =>
            updateRoles({
              variables: {
                participantId: staff.id ?? '',
                removeRoles: [ParticipantRoleType.Moderator],
                deniedMod: true,
              },
            })
          }
        />
      </Tab>
    </Tabs>
  )
}
