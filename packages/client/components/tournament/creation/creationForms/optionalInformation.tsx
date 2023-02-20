import { Input } from '@components/ui/input'
import React from 'react'
import styles from './optionalInformation.module.scss'

interface OptionalInformationFormProps {
  value?: OptionalInformationFormValue
  onChange?: ({ streamLink, prizePool }: OptionalInformationFormValue) => void
  validate?: (
    value?: OptionalInformationFormValue
  ) => Partial<Record<keyof OptionalInformationFormValue, string | null>> | null
}

export interface OptionalInformationFormValue {
  streamLink?: string
  prizePool?: string
}

export const OptionalInformationForm: React.FC<OptionalInformationFormProps> = ({
  value,
  onChange,
  validate,
}) => (
  <div className={styles.wrapper}>
    <Input
      placeholder="Streaming Platform Link"
      value={value?.streamLink}
      validate={() => validate?.(value)?.streamLink ?? null}
      onChange={(e) => onChange?.({ ...value, streamLink: e.target.value })}
    />
    <Input
      placeholder="Total Prize Pool / Prize"
      value={value?.prizePool}
      validate={() => validate?.(value)?.prizePool ?? null}
      onChange={(e) => onChange?.({ ...value, prizePool: e.target.value })}
    />
  </div>
)
