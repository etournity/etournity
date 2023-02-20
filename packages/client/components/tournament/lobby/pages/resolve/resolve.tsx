import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps } from '../..'
import { Icon } from '@components/ui/icon'
import styles from './resolve.module.scss'

export const Resolve: React.FC<LobbyPageProps> = ({ match, user }) => (
  <Dock
    showGameInfo
    user={user}
    match={match}
    phase="Post-Game-Phase"
    step={{ number: 5, info: 'Resolve with Moderator' }}
    tooltip={{
      title: 'Figuring out the True Winner',
      width: 20,
      content: (
        <div>
          <p>
            If the score comparison fails twice in a row, an error ticket is
            automatically sent to the organizer.
          </p>
          <br />
          <p>
            Join the support channel on the tournament Discord by following the
            link and resolve the issue with your opponent and the organizer.
          </p>
          <br />
          <p>
            Make sure to have your proof ready (usually screenshots of the
            ingame scoreboard).
          </p>
        </div>
      ),
    }}
  >
    <div className={styles.wrapper}>
      <span className={styles.info}>
        Please join the support channel on Discord with your proof
      </span>
      <div className={styles.linkWrapper}>
        <a
          className={styles.link}
          href={match.supportLink ?? ''}
          target="_blank"
          rel="noreferrer noopener"
        >
          <p>{match.supportLink ?? 'No Support Channel Set Up'}</p>
          <Icon variant="forward" color={styles.steel} />
        </a>
      </div>
    </div>
  </Dock>
)
