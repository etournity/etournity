import React from 'react'
import { Checkbox } from '@components/ui/checkbox'
import { Icon } from '@components/ui/icon'
import { RadioGroup, Radio } from '@components/ui/radio'
import { Platform } from '@generated/graphql'
import classNames from 'classnames'
import styles from './platformForm.module.scss'

interface PlatformFormProps {
  platforms: PlatformFormValue
  value?: PlatformFormValue
  onChange?: (platforms: Platform[]) => void
  validate?: (
    value?: PlatformFormValue
  ) => Partial<Record<string, string | null>> | null
}

export interface PlatformFormValue extends Array<Platform> {}

export const PlatformForm: React.FC<PlatformFormProps> = ({
  value,
  onChange,
  platforms,
  validate,
}) => {
  const allSelected = platforms.every((v) =>
    value?.map((v) => v.code)?.includes(v.code)
  )

  return (
    <>
      <RadioGroup
        name="radios"
        onChecked={(value) => {
          onChange?.(value.value === 'all' ? platforms : [])
        }}
      >
        <Radio checked={allSelected} label="All" value="all" />
        <Radio
          checked={!allSelected}
          label="Choose Specific"
          value="specific"
        />
      </RadioGroup>
      <div
        className={classNames(styles.platforms, {
          [styles.disabled]: allSelected,
        })}
      >
        {platforms.map((platform) => {
          const variant = getIconForPlatform(platform.name)

          return (
            <div key={platform.code} className={styles.checkbox}>
              <Checkbox
                key={platform.code}
                name={platform.name}
                value={platform.code}
                checked={value?.map((p) => p.code)?.includes(platform.code)}
                onChange={(e) =>
                  onChange?.(
                    value
                      ? e.target.checked
                        ? [...value, platform]
                        : value.filter((p) => p.code !== platform.code)
                      : []
                  )
                }
              >
                <span>
                  {variant === null ? null : (
                    <Icon variant={variant} className={styles.platformIcon} />
                  )}
                  {platform.name}
                </span>
              </Checkbox>
            </div>
          )
        })}
      </div>
      <p className={styles.errorText}>
        {validate?.(value)?.this ?? validate?.(value)?.platforms}
      </p>
    </>
  )
}

const getIconForPlatform = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'pc':
      return 'pc'
    case 'switch':
      return 'switch'
    case 'mobile':
      return 'mobile'
    case 'playstation':
      return 'playstation'
    case 'xbox':
      return 'xbox'
    default:
      return null
  }
}
