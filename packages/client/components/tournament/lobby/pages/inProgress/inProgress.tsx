import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps } from '../..'
import { Button } from '@components/ui/button'
import styles from './inProgress.module.scss'
import Link from 'next/link'

export const InProgress: React.FC<LobbyPageProps> = ({ match, user }) => (
  <Dock showGameInfo user={user} match={match} phase="Match in Progress">
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <p>The match is still in progress.</p>
        <p>Come back later to see the results.</p>
      </div>
      <Link
        passHref
        href={`/tournament/${match.round?.stage?.tournament?.id}/`}
      >
        <Button className={styles.button} variant="secondary">
          Return to brackets
        </Button>
      </Link>
    </div>
  </Dock>
)
