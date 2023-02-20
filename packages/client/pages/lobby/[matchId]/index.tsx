import React, { FC } from 'react'
import styles from './lobby.module.scss'
import Link from 'next/link'
import { Icon } from '@components/ui/icon'
import { Button } from '@components/ui/button'
import { Modal, ModalActions } from '@components/ui/modal'
import { MatchStatus, Team } from '@generated/graphql'

import {
  CheckIn,
  CreateLobby,
  JoinLobby,
  Scores,
  Compare,
  Results,
  Resolve,
  Loading,
  InProgress,
} from '@components/tournament/lobby/pages'
import { ErrorResult } from '@components/results/errorResult'
import { LobbyPageProps } from '@components/tournament/lobby'
import { useMatchlobbyPage } from '@hooks/setMatchlobbyStep'
import { Loader } from '@components/ui/loader'
import { useRouter } from 'next/router'
import Report from '@components/layouts/appLayout/report'

const Lobby = () => {
  const router = useRouter()
  const matchId = (router.query.matchId as string) || ''
  const { page, setPage, loading, user, match } = useMatchlobbyPage({
    matchId,
  })

  if (loading) return <Loader size={4} strokeWidth={0.375} />
  if (!user) return <ErrorResult description="No user found!" />
  if (!match) return <ErrorResult description="No match found!" />

  const canAccessMatch = Boolean(
    match?.opponents?.find((team) =>
      team.participants
        .map(({ user, kicked }) => (kicked ? null : user.id))
        .includes(user?.id ?? '')
    )
  )
  if (match.status === MatchStatus.Scheduled) {
    return (
      <ErrorResult
        hideReportButton
        title="Match hasn't started yet"
        description={
          canAccessMatch
            ? 'Come back when the match has started.'
            : 'Results are available once the match is finished.'
        }
        customActions={<Button onClick={() => router.back()}>Back</Button>}
      />
    )
  }

  const pages = {
    checkIn: CheckIn,
    createLobby: CreateLobby,
    joinLobby: JoinLobby,
    scores: Scores,
    compare: Compare,
    results: Results,
    resolve: Resolve,
    loading: Loading,
    inProgress: InProgress,
    error: null,
  }
  const CurrentPage: FC<LobbyPageProps> | null = pages[page]

  const isInMatch = Boolean(
    match.opponents.find((team) =>
      team.participants.some((participant) => participant.user.id === user?.id)
    )
  )

  const currentTeam = isInMatch
    ? match.opponents.find((team) =>
        team.participants.some(
          (participant) => participant.user.id === user?.id
        )
      )
    : match.opponents[0]

  const opponentTeam = isInMatch
    ? match.opponents.find(
        (team) =>
          !team.participants.some(
            (participant) => participant.user.id === user?.id
          )
      )
    : match.opponents[1]

  if (!CurrentPage) return <p>I&apos;ve got nothing.</p>

  const hasCreator = (team?: Team): boolean =>
    team?.participants?.some((participant) => participant.isCreator) ?? false

  const creatorTeam = hasCreator(currentTeam) ? currentTeam : opponentTeam
  const guestTeam = hasCreator(currentTeam) ? opponentTeam : currentTeam
  return (
    <div className={styles.wrapper}>
      <div className={styles.bestOf}>Best of {match.round?.format}</div>
      <CurrentPage
        match={match}
        user={user}
        isInMatch={isInMatch}
        switchTo={setPage}
        currentTeam={currentTeam}
        opponentTeam={opponentTeam}
        creatorTeam={creatorTeam}
        guestTeam={guestTeam}
      />
      <Modal
        hideCloseButton
        width="32rem"
        active={match.status === MatchStatus.NoShow && isInMatch}
        className={styles.noShowModal}
      >
        <div className={styles.modalTitle}>
          <Icon
            variant={
              currentTeam?.participantsReady ? 'tickSquare' : 'closeSquare'
            }
            color={
              currentTeam?.participantsReady ? styles.success : styles.error
            }
          />
          <h3>
            {currentTeam?.participantsReady
              ? 'Win - Opponent has been disqualified'
              : 'Disqualified'}
          </h3>
        </div>
        <div className={styles.modalContent}>
          {currentTeam?.participantsReady ? (
            <p>
              Your opponent didn&apos;t show up to the check-in. They have
              automatically lost the match and therefore the tournament.
              <br />
              You have automatically won this match.
              <br />
              Good luck in your next match!
            </p>
          ) : (
            <p>
              You have not completed the check-in process in time.
              <br />
              You have automatically lost this match, thereby losing the
              tournament.
              <br />
              You&apos;re free to drop out of a tournament at any time on the
              tournament info page.
            </p>
          )}
        </div>

        <ModalActions className={styles.modalActions}>
          <Link
            passHref
            href={
              match.round?.stage?.tournament?.id
                ? `/tournament/${match.round?.stage?.tournament?.id}/`
                : '/'
            }
          >
            <Button>
              {match.round?.stage?.tournament?.id
                ? 'Return to Brackets'
                : 'Return to Tournamentslist'}
            </Button>
          </Link>
        </ModalActions>
      </Modal>
      <Report tournamentId={match.round?.stage?.tournament?.id} />
    </div>
  )
}

export default Lobby
