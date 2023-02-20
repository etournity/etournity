import { Input } from '@components/ui/input'
import { Select } from '@components/ui/select'
import { StageType } from '@generated/graphql'
import { stageTypeMap } from '@pages/tournament/new'
import React from 'react'
import { GameMode } from './gameInformationForm'
import styles from './generalInformationForm.module.scss'

interface GeneralInformationFormProps {
  gameMode: GameMode | null
  value?: GeneralInformationFormValue
  onChange?: ({
    title,
    maxTeams,
    maxPlayers,
    type,
  }: GeneralInformationFormValue) => void
  validate?: (
    value?: GeneralInformationFormValue
  ) => Partial<Record<keyof GeneralInformationFormValue, string | null>> | null
}

export interface GeneralInformationFormValue {
  title?: string
  type?: StageType | null
  maxPlayers?: number
  maxTeams?: number
}

export const GeneralInformationForm: React.FC<GeneralInformationFormProps> = ({
  gameMode,
  value,
  onChange,
  validate,
}) => {
  const calculateTeamsFromPlayers = (
    maxPlayers: string,
    gameModeMultiplier: number
  ) => {
    const maxPlayersNumber = parseInt(maxPlayers, 10) || 0
    const maxTeams = Math.ceil(maxPlayersNumber / gameModeMultiplier)
    return maxTeams
  }

  const calculatePlayersFromTeams = (
    maxTeams: string,
    gameModeMultiplier: number
  ) => {
    const maxTeamsNumber = parseInt(maxTeams, 10) || 0
    const maxPlayers = maxTeamsNumber * gameModeMultiplier
    return maxPlayers
  }

  return (
    <div className={styles.wrapper}>
      <Input
        placeholder="Tournament Name"
        value={value?.title}
        validate={() => validate?.(value)?.title ?? null}
        onChange={(e) => onChange?.({ ...value, title: e.target.value ?? '' })}
      />
      <div>
        <Select<StageType>
          placeholder="Tournament Mode"
          options={Object.values(StageType).map((key) => ({
            title: stageTypeMap[key],
            value: key,
            data: key,
          }))}
          value={value?.type}
          validate={() => validate?.(value)?.type ?? null}
          onChange={(opt) => onChange?.({ ...value, type: opt?.data })}
        />
      </div>
      <div>
        <div className={styles.calcWrapper}>
          <Input
            placeholder="Max. Players"
            value={value?.maxPlayers ?? ''}
            onChange={(e) => {
              onChange?.({
                ...value,
                maxPlayers: parseInt(e.target.value, 10) || undefined,
                maxTeams: calculateTeamsFromPlayers(
                  e.target.value,
                  gameMode?.value ?? 1
                ),
              })
            }}
          />
          <span className={styles.equals}>=</span>
          <Input
            placeholder="Max. Teams"
            value={value?.maxTeams ?? ''}
            onChange={(e) =>
              onChange?.({
                ...value,
                maxTeams: parseInt(e.target.value, 10) || undefined,
                maxPlayers: calculatePlayersFromTeams(
                  e.target.value,
                  gameMode?.value ?? 1
                ),
              })
            }
          />
          <span className={styles.equals}>=</span>{' '}
          <p>
            {`${roundAmountFromParams({
              teamAmount: value?.maxTeams ?? 0,
              type: value?.type ?? null,
            }).toString()} Rounds`}
          </p>
        </div>
        <p className={styles.errorText}>
          {validate?.(value)?.maxPlayers ?? validate?.(value)?.maxTeams}
        </p>
      </div>
    </div>
  )
}

// Remember to also update the function on the server side if you change this
// packages/server/src/api/stage/stage.mutations.ts
export const roundAmountFromParams: ({
  teamAmount,
  type,
}: {
  teamAmount: number
  type: StageType | null
}) => number = ({ teamAmount, type }) => {
  if (teamAmount === 0) return 0
  switch (type) {
    case StageType.Single:
      return Math.ceil(Math.log2(teamAmount))
    default:
      return 0
  }
}
