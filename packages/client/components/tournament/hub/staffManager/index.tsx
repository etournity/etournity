import React from 'react'
import { StaffCard } from '@components/tournament/staffCard'
import { FloatingActionMenu } from '@components/ui/fam'
import { Icon } from '@components/ui/icon'
import { Participant } from '@generated/graphql'
import styles from './staffManager.module.scss'
import { Avatar } from '@components/ui/avatar'
import { PartialDeep } from 'type-fest'
import classNames from 'classnames'

export interface StaffManagerProps {
  staffList: Array<PartialDeep<Participant>>
  requestingMod: Array<PartialDeep<Participant>>
  hasAddPermission: boolean
  className?: string
  hasPermissionToKick: (participant: PartialDeep<Participant>) => boolean
  onAdd: (participant: PartialDeep<Participant>) => void
  onDeny: (participant: PartialDeep<Participant>) => void
  onKick: (participant: PartialDeep<Participant>) => void
}
export const StaffManager: React.FC<StaffManagerProps> = ({
  className,
  staffList,
  hasAddPermission,
  requestingMod = [],
  hasPermissionToKick,
  onAdd,
  onDeny,
  onKick,
}) => (
  <div className={classNames(styles.staffList, className)}>
    {staffList.map(
      (staff) =>
        staff.user && (
          <div>
            <StaffCard
              key={staff.id}
              participant={staff}
              kickable={hasPermissionToKick(staff) && !staff.isCurrentUser}
              onKick={() => onKick(staff)}
            />
          </div>
        )
    )}
    {hasAddPermission && (
      <div>
        <FloatingActionMenu
          placement="bottom"
          activator={
            <div className={styles.addButton}>
              <Icon variant="plus" size={2} />
              <span>Accept Moderators</span>
            </div>
          }
        >
          {requestingMod.length > 0
            ? requestingMod.map((player) => (
                <RequestOption
                  key={player.id}
                  player={player}
                  onClick={(action) =>
                    action === 'deny'
                      ? onDeny(player)
                      : action === 'accept'
                      ? onAdd(player)
                      : console.error(action, ' Action not recognized!')
                  }
                />
              ))
            : [
                <div key="noRequests">Mods need to apply on the Info Page</div>,
                <div key="empty" />,
              ]}
        </FloatingActionMenu>
      </div>
    )}
  </div>
)

export const RequestOption: React.FC<{
  player: PartialDeep<Participant>
  onClick: (action: 'accept' | 'deny') => void
}> = ({ player, onClick }) => (
  <div className={styles.request}>
    <div className={styles.user}>
      <Avatar userAccount={player?.user?.linkedAccounts?.[0]} size={1.25} />
      <span>{`${player?.user?.linkedAccounts?.[0]?.username}#${player?.user?.linkedAccounts?.[0]?.discriminator}`}</span>
    </div>
    <div className={styles.actions}>
      <span onClick={() => onClick('accept')}>
        <Icon variant="tick" color={styles.success} size={1} />
      </span>
      <span onClick={() => onClick('deny')}>
        <Icon variant="close" color={styles.error} size={1} />
      </span>
    </div>
  </div>
)
