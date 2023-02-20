import React, { useState } from 'react'
import styles from './hub.module.scss'
import { ParticipantManager, IssueTracker } from '@components/tournament/hub/'
import {
  useHubInfoQuery,
  useTournamentTicketsQuery,
  useTournamentParticipantsQuery,
  useTournamentChangedSubscription,
  useSetTournamentStatusMutation,
  useSetRoundStatusMutation,
  useSetStartTimeMutation,
  useSetCheckInMutation,
  useUpdateTournamentMutation,
  useDeleteTournamentMutation,
  TournamentStatus,
  StageType,
  ParticipantRoleType,
  useTournamentTicketChangedSubscription,
  Ticket,
  GetUserInfoDocument,
  GetTournamentsQuery,
  GetTournamentsDocument,
} from '@generated/graphql'
import { useRouter } from 'next/router'
import { TournamentInfoSummary } from '@components/tournament/tournamentInfoSummary'
import { Empty } from '@components/ui/empty'
import { RoundController } from '@components/tournament/roundController'
import { TournamentController } from '@components/tournament/tournamentController'
import { TournamentEditingModal } from '@components/tournament/tournamentEditingModal/tournamentEditingModal'
import { useAuth } from '@hooks/useAuth'
import { AccessWrapper } from '@components/ui/accessWrapper'
import { Icon } from '@components/ui/icon'
import { Button } from '@components/ui/button'
import { ConfirmationModal } from '@components/ui/confirmationModal'
import { DataHandler } from '@handlers/dataHandler'
import Link from 'next/link'
import { ErrorResult } from '@components/results/errorResult'
import { toast } from 'react-hot-toast'
import { MuiModal, MuiModalActions } from '@components/ui/muiModal'
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined'
import { Button as MuiButton, Typography } from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'

const Hub: React.FC = () => {
  const router = useRouter()
  const auth = useAuth()
  const [editingModalActive, setEditingModalActive] = useState(false)
  const [deleteModalActive, setDeleteModalActive] = useState(false)
  const [sharingModalActive, setSharingModalActive] = useState(false)
  const [copied, setCopied] = useState(false)
  const [setStartTime] = useSetStartTimeMutation({ onError: console.error })
  const [setCheckIn] = useSetCheckInMutation({ onError: console.error })

  const tournamentId = (router.query.tournamentId as string) ?? ''
  const user = auth?.user

  const {
    data: tournamentData,
    loading: tournamentLoading,
    error: tournamentError,
    refetch: tournamentRefetch,
  } = useHubInfoQuery({
    variables: { tournamentId },
    skip: !(tournamentId.length > 0),
    onError: (err) => {
      toast.error('Error fetching Tournament.')
      console.error(err)
    },
  })
  const {
    data: participantsData,
    loading: participantsLoading,
    error: participantsError,
    refetch: participantRefetch,
  } = useTournamentParticipantsQuery({
    variables: { tournamentId },
    skip: !(tournamentId.length > 0),
    onError: (err) => {
      toast.error('Error fetching participants.')
      console.error(err)
    },
  })
  const {
    data: ticketData,
    loading: ticketsLoading,
    error: ticketsError,
    refetch: ticketRefetch,
  } = useTournamentTicketsQuery({
    variables: { tournamentId },
    skip: !(tournamentId.length > 0),
    onError: (err) => {
      toast.error('Error fetching tickets.')
      console.error(err)
    },
  })
  const tournament = tournamentData?.tournament
  const participants = participantsData?.participantsFromTournament
  const tickets = ticketData?.tournamentTickets as Ticket[]
  const [setTournamentStatus] = useSetTournamentStatusMutation({
    onError: console.error,
  })
  const [deleteTournament] = useDeleteTournamentMutation({
    variables: {
      tournamentId,
    },
    onError: console.error,
    update: (cache) => {
      cache.updateQuery<GetTournamentsQuery>(
        {
          query: GetTournamentsDocument,
          variables: {
            userHasParticipantRoles: [
              ParticipantRoleType.Host,
              ParticipantRoleType.Admin,
            ],
          },
        },
        (data) => ({
          tournaments: data?.tournaments?.filter((t) => t?.id !== tournamentId),
        })
      )
    },
  })
  const [setRoundStatus] = useSetRoundStatusMutation({ onError: console.error })

  const [updateTournament] = useUpdateTournamentMutation({
    onError: console.error,
  })

  useTournamentChangedSubscription({
    variables: {
      tournamentId,
    },
    skip: !(tournamentId.length > 0),
    onSubscriptionData: () => {
      tournamentRefetch()
      participantRefetch()
    },
  })

  useTournamentTicketChangedSubscription({
    skip: !(tournamentId.length > 0),
    variables: {
      tournamentId,
    },
    onSubscriptionData: () => {
      ticketRefetch?.()
    },
  })

  const isHost =
    participants?.find((participant) => participant.isHost)?.isCurrentUser ??
    false

  const userNotStaff =
    participants?.filter(
      (participant) =>
        participant.roles.some(({ type }) =>
          [ParticipantRoleType.Host, ParticipantRoleType.Moderator].includes(
            type
          )
        ) && participant.user.id === user?.id
    ).length === 0

  const getConfirmationContent = (status: TournamentStatus) => {
    const title =
      status === TournamentStatus.Draft
        ? 'Delete Tournament?'
        : status === TournamentStatus.Started
        ? 'Force End?'
        : 'Cancel Tournament?'

    const buttonName =
      status === TournamentStatus.Draft
        ? 'DELETE'
        : status === TournamentStatus.Started
        ? 'Force End'
        : 'Cancel Tournament'

    const description =
      status === TournamentStatus.Started
        ? 'Are you sure? This will end the tournament for everyone!'
        : `Are you sure you want to ${
            status === TournamentStatus.Draft ? 'delete ' : 'cancel '
          }the tournament?`

    return { title, buttonName, description }
  }

  const isAfterStart = tournament?.status
    ? [
        TournamentStatus.Started,
        TournamentStatus.Finished,
        TournamentStatus.Cancelled,
        TournamentStatus.Error,
      ].includes(tournament?.status)
    : false

  const bracketsGenerated =
    (tournament?.stages?.[0]?.rounds?.[0]?.matches?.length ?? 0) > 0

  const isLoading = tournamentLoading

  if (
    isLoading ||
    tournamentError ||
    participantsError ||
    ticketsError ||
    !tournament
  )
    return (
      <DataHandler
        loading={isLoading}
        error={tournamentError ?? participantsError ?? ticketsError}
        errorDisplay={
          tournament && (userNotStaff || !user) ? (
            <div className={styles.notStaff}>
              <Icon variant="closeCircle" size={3} />
              <span>Whoops! You are not supposed to be here.</span>
              <span>
                Only tournament staff members have access to this page.
              </span>
              <Button
                onClick={() => router.push(`/tournament/${tournament.id}`)}
              >
                Back to Tournament Page
              </Button>
            </div>
          ) : (
            <ErrorResult
              description={
                tournament
                  ? `Error fetching data!`
                  : 'This tournament does not exist.'
              }
              customActions={
                <Link key="backList" passHref href="/">
                  <Button>Back To Tournaments</Button>
                </Link>
              }
            />
          )
        }
        dataAvailable={tournament !== undefined}
        noDataDisplay={
          <Empty
            description="This tournament does not exist."
            actions={
              <Link passHref href="/">
                <Button>Back To Tournaments</Button>
              </Link>
            }
          />
        }
      />
    )

  if ((!auth?.loading && !user) || userNotStaff)
    return (
      <div className={styles.notStaff}>
        <Icon variant="closeCircle" size={3} />
        <span>Whoops! You are not supposed to be here.</span>
        <span>Only tournament staff members have access to this page.</span>
        <Button onClick={() => router.push(`/tournament/${tournament.id}`)}>
          Back to Tournament Page
        </Button>
      </div>
    )

  return (
    <div className={styles.hub}>
      <div className={styles.hubBar}>
        <div className={styles.aligner}>
          <TournamentInfoSummary
            tournament={tournament}
            players={
              participants?.filter((participant) =>
                participant.roles.some(
                  (role) => role.type === ParticipantRoleType.Player
                )
              ) ?? []
            }
            openEditSettingsModal={() => setEditingModalActive(true)}
          />
          <AccessWrapper
            type={bracketsGenerated ? 'hover' : 'static'}
            title={isHost ? 'LOCKED' : 'NO ACCESS'}
            message={
              isHost
                ? 'UNLOCKS AT PHASE: PUBLISH BRACKETS'
                : 'ONLY HOST HAS ACCESS'
            }
            hasAccess={isHost && bracketsGenerated}
          >
            <RoundController
              tournamentStatus={tournament.status}
              rounds={tournament.stages[0].rounds}
              onChange={(change) => {
                setRoundStatus({
                  variables: {
                    roundId: change.roundId ?? '',
                    locked: change.change === 'locked',
                  },
                  onError: (err) => {
                    toast.error(err.message)
                  },
                })
              }}
            />
          </AccessWrapper>
        </div>
        <AccessWrapper
          type="hover"
          hasAccess={isHost}
          title="NO ACCESS"
          message="ONLY HOST HAS ACCESS"
          className={styles.tournamentController}
        >
          <TournamentController
            tournament={{ participants, ...tournament }}
            openEditSettingsModal={() => setEditingModalActive(true)}
            onModalPublish={() => {
              setTournamentStatus({
                variables: {
                  tournamentId,
                  status: TournamentStatus.Published,
                },
              })
              setSharingModalActive(true)
            }}
            onAddTimeStart={(time) =>
              setStartTime({ variables: { tournamentId, startTime: time } })
            }
            onAddTimeCheckIn={(time) =>
              setCheckIn({ variables: { tournamentId, endTime: time } })
            }
            onStartTournament={(setLoading) => {
              setTournamentStatus({
                variables: {
                  tournamentId,
                  status: TournamentStatus.Started,
                },
                refetchQueries: [GetUserInfoDocument],
              }).finally(() => setLoading?.(false))
            }}
            onForceEnd={() => setDeleteModalActive(true)}
          />
        </AccessWrapper>
        <MuiModal
          open={sharingModalActive}
          title="You have published your Tournament!"
          icon={<PublishOutlinedIcon />}
          className={styles.sharingModal}
          onClose={() => setSharingModalActive(false)}
        >
          <Typography variant="body">
            Share this link to your participants.
          </Typography>

          <Typography
            className={styles.link}
          >{`${window.location.origin}/tournament/${tournament.id}`}</Typography>
          <MuiButton
            variant="contained"
            className={styles.copyButton}
            startIcon={<ContentCopyOutlinedIcon />}
            onClick={() => {
              void navigator.clipboard.writeText(
                `${window.location.origin}/tournament/${tournament.id}`
              )
              setCopied(true)
            }}
          >
            {copied ? 'Copied!' : 'Copy Tournament Link'}
          </MuiButton>

          <MuiModalActions>
            <MuiButton onClick={() => setSharingModalActive(false)}>
              Proceed
            </MuiButton>
          </MuiModalActions>
        </MuiModal>
        {!(
          tournament.status === TournamentStatus.Cancelled ||
          tournament.status === TournamentStatus.Finished
        ) &&
          isHost && (
            <div
              className={styles.delete}
              onClick={() => setDeleteModalActive(true)}
            >
              <span>
                <Icon variant="bin" />
                {`${
                  tournament.status === TournamentStatus.Draft
                    ? 'Delete'
                    : 'Cancel'
                } Tournament`}
              </span>
            </div>
          )}
      </div>
      <div className={styles.lower}>
        <div className={styles.issueTracker}>
          <div className={styles.title}>ISSUE TRACKER</div>
          <AccessWrapper
            className={styles.issueLock}
            hasAccess={isAfterStart}
            message="UNLOCKS AT PHASE: START"
          >
            <IssueTracker
              tickets={tickets}
              loading={ticketsLoading}
              participants={participants}
            />
          </AccessWrapper>
        </div>
        <div className={styles.participantManager}>
          <div className={styles.title}>PARTICIPANT MANAGER</div>
          <AccessWrapper
            hasAccess={tournament.status !== TournamentStatus.Draft}
            message="UNLOCKS AT PHASE: PUBLISH"
          >
            <ParticipantManager
              showSeed={bracketsGenerated}
              participants={participants}
              loading={participantsLoading}
              tournamentId={tournamentId}
            />
          </AccessWrapper>
        </div>
      </div>
      <TournamentEditingModal
        active={editingModalActive}
        initialValues={{
          generalInformation: {
            title: tournament?.title,
            maxPlayers: tournament?.maxPlayers ?? undefined,
            maxTeams: tournament?.maxPlayers
              ? Math.ceil(tournament.maxPlayers / 1)
              : undefined,
            type: tournament?.stages?.[0].type,
          },
          additionalInformation: {
            language: tournament?.language,
            region: tournament?.region,
            discordSupportLink: tournament?.supportLink ?? undefined,
          },
          description: tournament?.description ?? '',
          gameInformation: {
            gameMode: {
              id: tournament?.gameMode.id ?? '1',
              title: tournament?.gameMode.name ?? '1 v 1',
              value: tournament?.gameMode.teamSize ?? 1,
            },
            game: tournament?.game,
          },
          timetable: {
            plannedStart: new Date(tournament?.date),
            checkInEnd: new Date(tournament?.checkinEnd),
            checkInStart: new Date(tournament?.checkinStart),
            noShow: tournament?.noShow,
          },
          optionalInformation: {
            prizePool: tournament?.prizePool ?? undefined,
            streamLink: tournament?.streamLink ?? undefined,
          },
          platforms: tournament?.platforms ?? [],
          ruleset: tournament?.rules ?? '',
        }}
        onClose={() => setEditingModalActive(false)}
        onSubmit={(formValues) => {
          updateTournament({
            variables: {
              tournamentId,
              data: {
                gameId: formValues.gameInformation.game?.id ?? '',
                gameModeId: formValues.gameInformation.gameMode?.id ?? '',
                title: formValues.generalInformation.title ?? '',
                description: formValues.description,
                type: formValues.generalInformation.type ?? StageType.Single,
                maxPlayers: formValues.generalInformation.maxPlayers ?? 8,
                noShow: formValues.timetable.noShow ?? 0,
                platforms: formValues.platforms.map(
                  (platform) => platform.code
                ),
                region: formValues.additionalInformation.region?.code,
                language: formValues.additionalInformation.language?.code,
                supportLink:
                  formValues.additionalInformation.discordSupportLink,
                checkinStart: formValues.timetable.checkInStart,
                checkinEnd: formValues.timetable.checkInEnd,
                date: formValues.timetable.plannedStart,
                rules: formValues.ruleset,
                streamLink: formValues.optionalInformation.streamLink,
                prizePool: formValues.optionalInformation.prizePool,
              },
            },
          }).then(() => setEditingModalActive(false))
        }}
      />
      <ConfirmationModal
        clickOutside
        active={deleteModalActive}
        title={getConfirmationContent(tournament.status).title}
        primaryBtnName={getConfirmationContent(tournament.status).buttonName}
        secondaryBtnName="Fuck, Go Back!"
        description={
          <>
            <p>{getConfirmationContent(tournament.status).description}</p>
            <p>
              <b>Note:</b> This action is not reversible!
            </p>
          </>
        }
        type="danger"
        onPrimary={() =>
          deleteTournament().then(async () => {
            setDeleteModalActive(false)
            if (tournament.status === TournamentStatus.Draft)
              await router.push('/tournaments')
          })
        }
        onCancel={() => setDeleteModalActive(false)}
      />
    </div>
  )
}

export default Hub
