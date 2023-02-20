import {
  AdditionalInformationForm,
  AdditionalInformationFormValue,
} from '@components/tournament/creation/creationForms/additionalInformationForm'
import {
  GameInformationFormValue,
  GameMode,
} from '@components/tournament/creation/creationForms/gameInformationForm'
import {
  GeneralInformationForm,
  GeneralInformationFormValue,
} from '@components/tournament/creation/creationForms/generalInformationForm'
import {
  OptionalInformationForm,
  OptionalInformationFormValue,
} from '@components/tournament/creation/creationForms/optionalInformation'
import {
  PlatformForm,
  PlatformFormValue,
} from '@components/tournament/creation/creationForms/platformForm'
import { Button } from '@components/ui/button'
import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { animateScroll as scroll } from 'react-scroll'
import {
  Game,
  StageType,
  useCreateTournamentMutation,
  useGetGamesQuery,
  GetTournamentsDocument,
  ParticipantRoleType,
  GetTournamentsQuery,
  RelatedChatRoomsDocument,
} from '@generated/graphql'
import { Empty } from '@components/ui/empty'
import { Icon } from '@components/ui/icon'
import { PartialDeep, ValueOf } from 'type-fest'
import {
  TimetableForm,
  TimetableFormValue,
} from '@components/tournament/creation/creationForms/timetableForm'
import Link from 'next/link'
import { DescriptionForm } from '@components/tournament/creation/creationForms/descriptionForm'
import { RulesetForm } from '@components/tournament/creation/creationForms/rulesetForm'
import EditForms from '@components/tournament/creation/editForms/editForms'
import * as Yup from 'yup'
import { createTournamentSchema } from '@etournity/shared/validation'
import {
  convertErrorsToFieldSpecific,
  convertErrorsToFormSpecific,
} from '@etournity/shared/validation/helpers'
import CardSelector from '@components/tournament/creation/cardSelector/cardSelector'
import MainForms from '@components/tournament/creation/mainForms/mainForms'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/useAuth'
import { toast } from 'react-hot-toast'
import { Loader } from '@components/ui/loader'

export interface CreationFormValues {
  gameInformation: GameInformationFormValue
  generalInformation: GeneralInformationFormValue
  platforms: PlatformFormValue
  additionalInformation: AdditionalInformationFormValue
  timetable: TimetableFormValue
  description: string
  ruleset: string
  optionalInformation: OptionalInformationFormValue
}

export interface BaseForm {
  title: string
  form: React.ReactElement
  name: keyof CreationFormValues
}

export const baseCreationValues = {
  gameInformation: {
    game: null,
    gameMode: null,
  },
  generalInformation: {
    title: '',
    maxPlayers: 0,
    maxTeams: 0,
    type: null,
  },
  platforms: [],
  additionalInformation: {
    language: null,
    region: null,
    discordSupportLink: '',
  },
  timetable: {
    checkInStart: null,
    checkInEnd: null,
    plannedStart: null,
    noShow: 10,
  },
  description: '<p><br></p>',
  ruleset: '<p><br></p>',
  optionalInformation: {
    prizePool: '',
    streamLink: '',
  },
}

export const stageTypeMap: Record<StageType, string> = {
  SINGLE: 'Single Elimination',
}

export const baseForms = (formValues: CreationFormValues): BaseForm[] => [
  {
    title: 'General Information',
    name: 'generalInformation',
    form: (
      <GeneralInformationForm
        gameMode={
          formValues?.gameInformation?.gameMode ?? {
            id: '1',
            title: '1 v 1',
            value: 1,
          }
        }
      />
    ),
  },
  {
    title: 'Platform',
    name: 'platforms',
    form: (
      <PlatformForm
        platforms={[
          { code: 'pc', name: 'PC' },
          { code: 'switch', name: 'Switch' },
          { code: 'mobile', name: 'Mobile' },
          { code: 'xbox', name: 'XBOX' },
          { code: 'playstation', name: 'PlayStation' },
        ]}
      />
    ),
  },
  {
    title: 'Timetable',
    name: 'timetable',
    form: <TimetableForm />,
  },
  {
    title: 'Additional Information',
    name: 'additionalInformation',
    form: <AdditionalInformationForm />,
  },
  {
    title: 'Ruleset',
    name: 'ruleset',
    form: <RulesetForm />,
  },
  {
    title: 'Description',
    name: 'description',
    form: <DescriptionForm />,
  },
  {
    title: 'Optional Information',
    name: 'optionalInformation',
    form: <OptionalInformationForm />,
  },
]

const NewTournamentPage = () => {
  const { data, loading, error } = useGetGamesQuery()
  const [
    createTournament,
    { data: creationData, loading: creationLoading },
  ] = useCreateTournamentMutation({
    update: (cache, { data: createData }) => {
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
          tournaments: data?.tournaments
            ? [...data.tournaments, createData?.createTournament ?? null]
            : [createData?.createTournament ?? null],
        })
      )
    },
    refetchQueries: [{ query: RelatedChatRoomsDocument }],
  })

  const [returnTo, setReturnTo] = useState<string | undefined>(undefined)

  const [formValues, setFormValues] = useState<CreationFormValues>(
    baseCreationValues
  )
  // Switch default to 0 after testing!
  const [activePage, setActivePage] = useState(0)

  const [errors, setErrors] = React.useState<Partial<
    Record<string, string | null>
  > | null>(null)
  const auth = useAuth()
  const user = auth?.user
  const router = useRouter()

  useEffect(() => {
    setReturnTo(window.location.origin + router.asPath)
  }, [router])

  const onFormSubmit = async () => {
    const result = await validateCreationFormsTogether(formValues)

    if (result) {
      setErrors(result)
    } else {
      createTournament({
        variables: {
          data: {
            gameId: formValues.gameInformation.game?.id ?? '',
            gameModeId: formValues.gameInformation.gameMode?.id ?? '',
            title: formValues.generalInformation.title ?? '',
            description: formValues.description,
            type: formValues.generalInformation.type ?? StageType.Single,
            maxPlayers: formValues.generalInformation.maxPlayers ?? 8,
            platforms: formValues.platforms.map((platform) => platform.code),
            region: formValues.additionalInformation.region?.code,
            language: formValues.additionalInformation.language?.code,
            supportLink: formValues.additionalInformation.discordSupportLink,
            checkinStart: formValues.timetable.checkInStart,
            checkinEnd: formValues.timetable.checkInEnd,
            noShow: formValues.timetable.noShow ?? 0,
            date: formValues.timetable.plannedStart,
            rules: formValues.ruleset,
            streamLink: formValues.optionalInformation.streamLink,
            prizePool: formValues.optionalInformation.prizePool,
          },
        },
      })
        .then((value) => {
          if (value.data?.createTournament) {
            return router.push(
              `/tournament/${value.data.createTournament.id}/hub`
            )
          }
        })
        .catch((err) => {
          console.error(err)
          toast.error(
            'Error while creating tournament, please contact an administrator.'
          )
        })
    }
  }

  const gameModes: GameMode[] = [
    {
      id: '1',
      title: '1 v 1',
      value: 1,
    },
  ]

  useEffect(() => {
    scroll.scrollToTop()
  }, [activePage])

  if (auth?.loading) return <Loader />
  if (!user || !user.roles.includes('organizer'))
    return (
      <div className={styles.noAccess}>
        <span>Just one more step before you can start.</span>
        <span>
          Please log in with Discord before you can create a new tournament.
        </span>
        <Link
          passHref
          href={`${
            process.env.GRAPHQL_SERVER_URL ?? ''
          }/auth/discord?returnTo=${returnTo}`}
        >
          <Button>Log in with Discord</Button>
        </Link>
      </div>
    )
  if (error)
    return (
      <Empty
        icon={<Icon variant="closeCircle" size={5} />}
        title="Error"
        description="An error occurred while loading the page."
      />
    )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.spacer}>
          <Link passHref href="/">
            <Button
              data-cy="cancel"
              variant="secondary"
              className={styles.cancel}
            >
              Cancel Creation
            </Button>
          </Link>
        </div>
        <p>Tournament Creation</p>
        <div className={styles.spacer} />
      </div>
      {activePage !== 0 && (
        <div className={styles.title}>
          {getPageTitle(activePage, formValues)}
        </div>
      )}
      <div className={styles.content}>
        <div
          className={classNames(styles.gameModePage, {
            [styles.collapsed]: activePage !== 0,
          })}
        >
          <div data-cy="gameSelect">
            <p>1. Game Selection</p>
            <CardSelector<PartialDeep<Game>>
              value={formValues.gameInformation.game}
              options={[
                ...(loading
                  ? []
                  : data?.games?.map((game) => ({
                      title: game.title,
                      value: game,
                      img: game.image?.url,
                    })) ?? []),
                { title: 'Other Games', subtitle: 'Coming Soon\u2122' },
              ]}
              comparator={(a, b) => (a && b ? a?.id === b?.id : false)}
              onChange={(val) =>
                setFormValues({
                  ...formValues,
                  gameInformation: {
                    ...formValues.gameInformation,
                    game: val,
                  },
                })
              }
            />
          </div>
          <div data-cy="modeSelect">
            <p>2. Mode Selection</p>
            <CardSelector<GameMode>
              value={formValues.gameInformation.gameMode}
              options={[
                ...gameModes.map((gameMode) => ({
                  title: gameMode.title,
                  value: gameMode,
                })),
                { title: '2 v 2', subtitle: 'Coming Soon' },
              ]}
              comparator={(a, b) => (a && b ? a?.id === b?.id : false)}
              onChange={(val) =>
                setFormValues({
                  ...formValues,
                  gameInformation:
                    {
                      ...formValues.gameInformation,
                      gameMode: val,
                    } ?? null,
                })
              }
            />
          </div>
        </div>
        <div
          className={classNames(styles.mainPage, {
            [styles.collapsed]: activePage !== 1,
          })}
        >
          <MainForms
            formValues={formValues}
            forms={baseForms(formValues)}
            onChange={setFormValues}
            onValidSubmit={() => setActivePage(2)}
          />
        </div>
        <div
          className={classNames(styles.summary, {
            [styles.collapsed]: activePage !== 2,
          })}
        >
          <EditForms
            mode="summary"
            formValues={formValues}
            forms={baseForms(formValues)}
            errors={errors}
            onChange={setFormValues}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.spacer} />

        {activePage === 2 ? (
          <div className={styles.mainBtnDiv}>
            {errors && (
              <p className={styles.mainBtnErrorText}>
                Error: Please review your inputs
              </p>
            )}
            <Button
              className={styles.button}
              loading={creationLoading}
              disabled={Boolean(creationData?.createTournament)}
              data-cy="CreateTournamentButton"
              onClick={onFormSubmit}
            >
              {creationData?.createTournament
                ? 'Tournament Created'
                : 'Confirm and Create Tournament'}
            </Button>
          </div>
        ) : (
          <p>{getPageTitle(activePage + 1, formValues)}</p>
        )}
        <div className={styles.spacer}>
          <Button
            data-cy="confirm"
            disabled={
              !formValues.gameInformation.game ||
              !formValues.gameInformation.gameMode
            }
            className={classNames(styles.button, {
              [styles.hidden]: activePage !== 0,
            })}
            onClick={() => setActivePage(1)}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}

const getSelectString = (values: CreationFormValues) => {
  let title = ''

  if (values.gameInformation.game) title += values.gameInformation.game.title
  if (values.gameInformation.gameMode)
    title += ` - ${values.gameInformation.gameMode.title}`
  if (values.generalInformation.maxPlayers)
    title += ` - ${values.generalInformation.maxPlayers} Players`
  if (values.generalInformation.type)
    title += ` - ${stageTypeMap[values.generalInformation.type]}`

  return title
}

const getPageTitle = (page: number, values: CreationFormValues) => {
  const selectionString = getSelectString(values)
  switch (page) {
    case 1:
      return selectionString
    case 2:
      return 'Summary'
    default:
      return ''
  }
}

export const validateCreationFormsIndividually = async (
  values: ValueOf<CreationFormValues>,
  name: keyof CreationFormValues
) => {
  // Any because of a bug with Yup typings: https://github.com/jquense/yup/issues/1155
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorValidation: any = createTournamentSchema.client[name]

  const errors = await errorValidation
    .validate(values, { abortEarly: false, stripUnknown: true })
    .then(() => null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => e.inner)

  return errors ? { [name]: convertErrorsToFormSpecific(errors) } : null
}

export const validateCreationFormsTogether = async (
  values: CreationFormValues
) => {
  const errors = await Yup.object(createTournamentSchema.client)
    .validate(values, { abortEarly: false, stripUnknown: true })
    .then(() => null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => e.inner)

  return errors ? convertErrorsToFieldSpecific(errors) : null
}

export default NewTournamentPage
