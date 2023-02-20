import React from 'react'
import { Avatar } from '@components/ui/avatar'
import { Icon } from '@components/ui/icon'
import { FloatingActionMenu } from '@components/ui/fam'
import { Participant, ParticipantRoleType } from '@generated/graphql'
import styles from './staffCard.module.scss'
import { PartialDeep } from 'type-fest'
import classNames from 'classnames'

export interface StaffCardProps {
  participant: PartialDeep<Participant>
  onKick?: () => void
  accountProvider?: string
  kickable?: boolean
}
export const StaffCard: React.FC<StaffCardProps> = ({
  participant,
  onKick,
  accountProvider,
  kickable,
}) => {
  const userAccount =
    participant?.user?.linkedAccounts?.find(
      (account) => account?.provider === (accountProvider ?? 'custom')
    ) ?? participant?.user?.linkedAccounts?.[0]
  const roleString = participant?.roles
    ?.map((role) =>
      role?.type === ParticipantRoleType.Moderator
        ? 'Mod.'
        : `${role?.type?.substring(0, 1).toUpperCase()}${role?.type
            ?.substring(1)
            .toLowerCase()}`
    )
    .join(' + ')

  return (
    <div className={styles.card}>
      <div className={styles.upper}>
        <div className={styles.spacer} />
        <span className={styles.role}>{roleString}</span>
        {kickable ? (
          <FloatingActionMenu className={styles.menu}>
            <span key="kick" onClick={onKick}>
              <Icon variant="boot" size={1} color={styles.error} /> Kick
              Moderator
            </span>
            <div />
          </FloatingActionMenu>
        ) : (
          <div className={styles.spacer} />
        )}
      </div>
      <Avatar size={2} userAccount={userAccount} />
      <div className={styles.discordName}>{participant?.user?.displayName}</div>
      <div
        className={styles.discriminator}
      >{`#${userAccount?.discriminator}`}</div>

      <div
        className={classNames(styles.ingameName, {
          [styles.hidden]:
            !participant?.user?.gameUsers?.[0]?.inGameName ||
            !participant.roles?.find(
              (role) => role?.type === ParticipantRoleType.Player
            ),
        })}
      >
        <Icon variant="people" size={0.75} />
        <span>{participant?.user?.gameUsers?.[0]?.inGameName}</span>
      </div>
    </div>
  )
}
