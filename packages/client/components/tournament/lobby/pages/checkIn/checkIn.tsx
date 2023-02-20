import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps, LobbyPage } from './../../'
import styles from './checkIn.module.scss'
import { useCreateReadyCheckMutation } from '@generated/graphql'
import { Button } from '@components/ui/button'
import { Countdown } from '@components/ui/time'
import { Loader } from '@components/ui/loader'
import dayjs from 'dayjs'

export const CheckIn: React.FC<LobbyPageProps> = ({
  match,
  user,
  switchTo,
  creatorTeam,
  guestTeam,
  currentTeam,
}) => {
  const participantId = user?.currentParticipant?.id

  const participants = match.opponents.flatMap(
    (opponent) => opponent.participants
  ).length

  const userReady = currentTeam?.participants.find(
    ({ id }) => id === user.currentParticipant?.id
  )?.isReady
  const [createReadyCheck] = useCreateReadyCheckMutation({
    variables: {
      matchId: match.id,
      participantId: participantId || '',
    },
    onCompleted: (data) => {
      if (!(data.createReadyCheck?.match.readyChecks.length === participants))
        return
      if (data.createReadyCheck?.participant.isCreator) {
        switchTo(LobbyPage.CreateLobby)
      } else {
        switchTo(LobbyPage.JoinLobby)
      }
    },
    onError: console.error,
  })
  return (
    <Dock
      match={match}
      user={user}
      phase="PRE-GAME PHASE"
      step={{
        number: 1,
        info: 'Ready-Check',
      }}
      creator={{
        description: `${creatorTeam?.participantsReady || 0}/${
          creatorTeam?.participants?.length || 0
        } PLAYERS READY`,
        icon: { variant: 'people' },
        progress:
          ((creatorTeam?.participantsReady || 0) /
            (creatorTeam?.participants?.length || 0)) *
          100,
      }}
      guest={{
        description: `${guestTeam?.participantsReady || 0}/${
          guestTeam?.participants?.length || 0
        } PLAYERS READY`,
        icon: { variant: 'people' },
        progress:
          ((guestTeam?.participantsReady || 0) /
            (guestTeam?.participants?.length || 0)) *
          100,
      }}
    >
      <div className={styles.wrapper}>
        {userReady ? (
          <div className={styles.waiting}>
            <div className={styles.spacer} />
            <div className={styles.loader}>
              <Loader color={styles.steel} />
              <span className={styles.info}>
                Waiting for everyone to be ready.
              </span>
            </div>
            <div className={styles.timer}>
              <Countdown endTime={match.noShowTimer} color={styles.steel} />
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            type="button"
            className={styles.button}
            onClick={() => createReadyCheck()}
          >
            <div className={styles.spacer} />
            <span className={styles.text}>READY</span>
            <div className={styles.timer}>
              {(!match.noShowTimer || !dayjs().isAfter(match.noShowTimer)) && (
                <Countdown endTime={match.noShowTimer} color={styles.steel} />
              )}
            </div>
          </Button>
        )}
      </div>
    </Dock>
  )
}
