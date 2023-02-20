import React, { useEffect, useState } from 'react'

import { DiscordLoginButton } from '@components/actions/discordLoginButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { toast } from 'react-hot-toast'
import {
  Participant,
  Tournament,
  TournamentInfoDocument,
  useAddParticipantMutation,
  useCheckinParticipantMutation,
  RelatedChatRoomsDocument,
} from '@generated/graphql'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { PartialDeep } from 'type-fest'
import styles from './authFlow.module.scss'
import { tournamentRegisterSchema } from '@etournity/shared/validation'
import { useRouter } from 'next/router'
import { ValidationError } from 'yup'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MuiModal, MuiModalActions } from '@components/ui/muiModal'
import LoginOutlined from '@mui/icons-material/LoginOutlined'
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined'
import TimerOutlined from '@mui/icons-material/TimerOutlined'
import { TournamentPhase } from '../TournamentSchedule/tournamentPhase'
import { useTime } from '@hooks/useTime'
export interface FormValues {
  elo: number
  name: string
}

export interface AuthFlowProps {
  modalActive: boolean
  tournament: Tournament | undefined
  currentParticipant?: PartialDeep<Participant>
  bracketsReady: boolean
  pageIndex?: number
  path: 'moderator' | 'player'
  isLoggedIn: boolean
  onClose: () => void
}

export const AuthFlow: React.FC<AuthFlowProps> = ({
  modalActive,
  tournament,
  pageIndex,
  path,
  onClose,
  isLoggedIn,
  currentParticipant,
  bracketsReady,
}) => {
  const [activePage, setActivePage] = useState(pageIndex ?? 0)
  const [currentPath, setCurrentPath] = useState(path)
  const [errors, setErrors] = useState<{
    inGameName: string | null | undefined
    elo: string | null | undefined
  } | null>(null)
  const [formState, setFormState] = useState<{
    inGameName: string | null
    elo: number | null
  }>({ inGameName: null, elo: null })
  const { now } = useTime()
  const router = useRouter()
  const tournamentId = (router.query.tournamentId as string) || ''

  const [addParticipant] = useAddParticipantMutation({
    update: (cache, { data }) => {
      const cached: any = cache.readQuery({
        query: TournamentInfoDocument,
        variables: {
          tournamentId,
        },
      })
      if (cached) {
        cache.writeQuery({
          query: TournamentInfoDocument,
          variables: { tournamentId },
          data: {
            tournament: {
              ...cached.tournament,
              participants: [
                ...cached.tournament.participants,
                data?.addParticipant,
              ],
            },
          },
        })
      }
    },
    refetchQueries: [{ query: RelatedChatRoomsDocument }],
  })
  const [checkinParticipant] = useCheckinParticipantMutation({
    variables: { tournamentId: tournamentId ?? '' },
    onError: (err) => toast.error(err.message),
  })

  useEffect(() => {
    setActivePage(pageIndex ?? isLoggedIn ? 1 : 0)
  }, [path, pageIndex, isLoggedIn])

  const paths: Record<typeof path, number[]> = {
    moderator: [0, 4, 5],
    player: [0, 1, 2, 3],
  }

  const activePath = paths[currentPath]

  const moveForward = () => {
    if (pages[activePath[activePage + 1]]) setActivePage(activePage + 1)
    else closeModal()
  }

  /**
   *
   * @param value - input value
   * @param name - input field name
   * @returns True, if the input is valid and false otherwise.
   */

  const validateInput = (
    value: string | number | null,
    name: 'inGameName' | 'elo'
  ): boolean => {
    let result = true
    try {
      tournamentRegisterSchema.client.validateSyncAt(
        name,
        {
          inGameName:
            name === 'inGameName' && typeof value === 'string'
              ? value ?? ''
              : '',
          elo: name === 'elo' && typeof value === 'number' ? value ?? 0 : 0,
        },
        { abortEarly: false }
      )
      // Reset errors
      result = true
      setErrors((prev) => ({
        inGameName: name === 'inGameName' ? null : prev?.inGameName ?? null,
        elo: name === 'elo' ? null : prev?.elo ?? null,
      }))
    } catch (error: unknown) {
      const { errors } = error as ValidationError
      result = false
      setErrors((prev) => ({
        inGameName:
          name === 'inGameName'
            ? errors[errors.length - 1]
            : prev?.inGameName ?? null,
        elo: name === 'elo' ? errors[errors.length - 1] : prev?.elo ?? null,
      }))
    }

    return result
  }

  const closeModal = () => {
    setActivePage(isLoggedIn ? 1 : 0)
    onClose()
  }

  const onSubmit = () => {
    addParticipant({
      variables: {
        tournamentId: tournamentId ?? '',
        name: formState.inGameName,
        elo: formState.elo,
        requestingMod: currentPath === 'moderator',
      },
    })
      .then(({ data }) => {
        if (
          dayjs().isBetween(tournament?.checkinStart, tournament?.checkinEnd) &&
          data?.addParticipant?.isPlayer &&
          formState.inGameName &&
          formState.elo
        )
          checkinParticipant().then(() =>
            setActivePage(activePath[activePath.length - 1])
          )
        else moveForward()
        // Reset form values
        setFormState({ elo: null, inGameName: null })
      })
      .catch((err) => {
        toast.error(err.message)
        closeModal()
      })
  }

  const pages: Array<{
    icon: JSX.Element
    title: string
    content: string | JSX.Element
    buttons?: JSX.Element | JSX.Element[]
  }> = [
    {
      icon: <LoginOutlined />,
      title: 'Sign-in via Discord',
      content: (
        <Box className={styles.wrapper}>
          <Typography>
            Before you can proceed you need to log-in with Discord.
          </Typography>
          <Box className={styles.spacer} />
          <DiscordLoginButton className={styles.discordButton} />
          <Box className={styles.spacer} />
          <Typography variant="title">Why Discord?</Typography>
          <Typography>
            It&apos;s easier for you and for us! No need to create another
            account, no need to upload a profile picture and no fear that your
            name is already taken.
          </Typography>
          <Box className={styles.spacer} />

          <Typography>
            Don&apos;t worry, your data stays on the discord servers.
          </Typography>
        </Box>
      ),
      buttons: <Button onClick={closeModal}>Cancel</Button>,
    },
    {
      icon: <HowToRegOutlined />,
      title: 'Registration',
      content: (
        <Box className={styles.wrapper}>
          <Typography>
            Enter your In-Game Name and your Elo to register for the tournament.
          </Typography>
          <TextField
            label="In-Game Name"
            name="inGameName"
            className={styles.input}
            variant="outlined"
            onChange={(e: any) => {
              if (errors?.inGameName !== undefined)
                validateInput(e.target.value?.toString() ?? '', 'inGameName')

              setFormState((prev) => ({
                ...prev,
                inGameName: e.target.value,
              }))
            }}
          />
          <TextField
            label="Elo"
            name="elo"
            type="number"
            className={styles.input}
            error={Boolean(errors?.elo)}
            variant="outlined"
            onChange={(e: any) => {
              if (errors?.elo !== undefined)
                validateInput(Number(e.target.value), 'elo')
              setFormState((prev) => ({
                ...prev,
                elo: Number(e.target.value),
              }))
            }}
          />
          <Typography className={styles.errorText}>{errors?.elo}</Typography>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.brawlhalla.com/rankings/1v1/"
            className={styles.eloCheck}
          >
            CHECK YOUR ELO
          </a>
        </Box>
      ),
      buttons: [
        <Button key="cancel" onClick={closeModal}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          onClick={() => {
            if (
              validateInput(formState.inGameName, 'inGameName') &&
              validateInput(formState.elo, 'elo') &&
              (!errors || (errors?.inGameName === null && errors?.elo === null))
            )
              onSubmit()
          }}
        >
          Confirm
        </Button>,
      ],
    },
    {
      icon: <CheckOutlined />,
      title: 'Registered',
      content: (
        <Box className={styles.wrapper}>
          <TournamentPhase
            tournament={tournament}
            bracketsReady={bracketsReady}
          />
          {now.isBefore(tournament?.checkinEnd) ? (
            <Typography>
              Check-In means you are ready to play. Missing check-in will kick
              you from this tournament.
            </Typography>
          ) : (
            <Typography>
              You&apos;ve missed the check-in! You are not able to participate
              in this tournament.
            </Typography>
          )}
        </Box>
      ),
      buttons: [
        <Button key="confirm" onClick={closeModal}>
          Alright
        </Button>,
      ],
    },
    {
      icon: <CheckOutlined />,
      title: 'Registered & Checked in',
      content: (
        <Box className={styles.wrapper}>
          <TournamentPhase
            tournament={tournament}
            bracketsReady={bracketsReady}
          />
          <Typography>
            You are all set! The organizer will start the tournament when the
            countdown hits zero.
          </Typography>
        </Box>
      ),
      buttons: [
        <Button key="confirm" onClick={closeModal}>
          Alright
        </Button>,
      ],
    },
    {
      icon: <WarningAmberOutlined />,
      title: 'Moderation Request',
      content: (
        <Box>
          <Typography>
            Are you sure you want to request moderator access?
          </Typography>
          <Typography>The host will need to accept your request.</Typography>
        </Box>
      ),
      buttons: [
        <Button key="cancel" onClick={closeModal}>
          Cancel
        </Button>,
        <Button key="confirm" onClick={onSubmit}>
          Send Request
        </Button>,
      ],
    },
    {
      icon: <TimerOutlined />,
      title: 'Request Sent',
      content: (
        <Box>
          <Typography>The host needs to approve your request.</Typography>
          <Typography>
            Once you are accepted, you will see navigation to the &quot;Host
            Hub&quot;.
          </Typography>
        </Box>
      ),
      buttons: [
        <Button key="confirm" onClick={closeModal}>
          Alright
        </Button>,
      ],
    },
  ]

  useEffect(() => {
    if (pageIndex) setActivePage(pageIndex)
    setCurrentPath(path)
  }, [pageIndex, path])

  const currentPage = pages[activePath[activePage]] ?? ''

  // When kicked but applying as mod, skip role selection
  if (path === 'moderator' && currentParticipant?.kicked && activePage === 1)
    moveForward()

  return (
    <MuiModal
      key={path}
      className={styles.authFlowModal}
      open={modalActive}
      title={currentPage.title}
      icon={currentPage.icon}
    >
      <Box
        className={styles.content}
        sx={{ width: { xs: 312, md: 380, lg: 420 } }}
      >
        {currentPage.content}
      </Box>
      <MuiModalActions>{currentPage.buttons}</MuiModalActions>
    </MuiModal>
  )
}
