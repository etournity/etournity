import { Input } from '@components/ui/input'
import { Select } from '@components/ui/select'
import {
  Region,
  Language,
  useGetLanguagesQuery,
  useGetRegionsQuery,
} from '@generated/graphql'
import { DataHandler, shouldDataHandle } from '@handlers/dataHandler'
import React from 'react'
import styles from './additionalInformationForm.module.scss'

interface AdditionalInformationFormProps {
  value?: AdditionalInformationFormValue
  onChange?: ({ region, language }: AdditionalInformationFormValue) => void
  validate?: (
    value?: AdditionalInformationFormValue
  ) => Partial<
    Record<keyof AdditionalInformationFormValue, string | null>
  > | null
}

export interface AdditionalInformationFormValue {
  region?: Region | null
  language?: Language | null
  discordSupportLink?: string
}

export const AdditionalInformationForm: React.FC<AdditionalInformationFormProps> = ({
  value,
  onChange,
  validate,
}) => {
  const languageQuery = useGetLanguagesQuery({
    onError: console.error,
  })
  const regionQuery = useGetRegionsQuery({
    onError: console.error,
  })

  return (
    <DataHandler
      loading={languageQuery.loading ?? regionQuery.loading}
      error={languageQuery.error ?? regionQuery.error}
      dataAvailable={
        languageQuery.data !== undefined || regionQuery.data !== undefined
      }
    >
      <div className={styles.wrapper}>
        <Select<Region>
          placeholder="Region"
          options={regionQuery.data?.regions.map((region) => ({
            title: region.name,
            value: region.code,
            data: region,
          }))}
          value={value?.region?.code}
          validate={() => validate?.(value)?.region ?? null}
          onChange={(opt) => onChange?.({ ...value, region: opt?.data })}
        />
        <Select<Language>
          placeholder="Language"
          options={languageQuery.data?.languages?.map((language) => ({
            title: language?.name ?? '',
            value: language?.code ?? '',
            data: language,
          }))}
          value={value?.language?.code}
          validate={() => validate?.(value)?.language ?? null}
          onChange={(opt) => onChange?.({ ...value, language: opt?.data })}
        />
        <Input
          placeholder="Link your Tournament Discord"
          value={value?.discordSupportLink}
          validate={() => validate?.(value)?.discordSupportLink ?? null}
          onChange={(e) =>
            onChange?.({ ...value, discordSupportLink: e.target.value })
          }
        />
      </div>
    </DataHandler>
  )
}
