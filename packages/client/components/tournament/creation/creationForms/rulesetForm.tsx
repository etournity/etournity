import { RichTextEditor } from '@components/ui/richTextEditor'
import React from 'react'
import styles from './rulesetForm.module.scss'

interface RulesetFormProps {
  value?: string
  onChange?: (value: string) => void
  validate?: (value?: string) => Partial<Record<string, string | null>> | null
}

export const RulesetForm: React.FC<RulesetFormProps> = ({
  value,
  onChange,
  validate,
}) => (
  <>
    <RichTextEditor placeholder="Ruleset" value={value} onChange={onChange} />
    <p className={styles.errorText}>
      {validate?.(value)?.this ?? validate?.(value)?.ruleset}
    </p>
  </>
)
