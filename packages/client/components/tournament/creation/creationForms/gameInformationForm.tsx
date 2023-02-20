import { ErrorResult } from '@components/results/errorResult'
import { ProgressCircle } from '@components/ui/progress'
import { Select } from '@components/ui/select'
import { Game, useGetGamesQuery } from '@generated/graphql'
import React from 'react'
import { PartialDeep } from 'type-fest'

interface GameInformationFormProps {
  gameModes: GameMode[]
  value?: GameInformationFormValue
  onChange?: ({ game, gameMode }: GameInformationFormValue) => void
  validate?: (
    value?: GameInformationFormValue
  ) => Partial<Record<string, string | null>> | null
}

export interface GameMode {
  id: string
  title: string
  value: number
}

export interface GameInformationFormValue {
  game?: PartialDeep<Game> | null
  gameMode?: GameMode | null
}

export const GameInformationForm: React.FC<GameInformationFormProps> = ({
  gameModes,
  value,
  onChange,
  validate,
}) => {
  const { data, loading, error } = useGetGamesQuery()

  if (loading) return <ProgressCircle />
  if (error) return <ErrorResult />

  const games = data?.games || []

  return (
    <>
      <Select<PartialDeep<Game>>
        placeholder="Game"
        options={games.map((game) => ({
          title: game.title,
          value: game.id,
          data: game,
        }))}
        value={value?.game?.id}
        validate={() => validate?.(value)?.game ?? null}
        onChange={(opt) => onChange?.({ ...value, game: opt?.data })}
      />
      <Select<GameMode>
        placeholder="Game Mode"
        options={gameModes.map((gameMode) => ({
          title: gameMode.title,
          value: gameMode.id,
          data: gameMode,
        }))}
        value={value?.gameMode?.id}
        validate={() => validate?.(value)?.gameMode ?? null}
        onChange={(opt) => onChange?.({ ...value, gameMode: opt?.data })}
      />
    </>
  )
}
