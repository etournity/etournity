import { RichTextEditor } from '@components/ui/richTextEditor'
import React from 'react'
import styles from './descriptionForm.module.scss'

interface DescriptionFormProps {
  value?: string
  onChange?: (value: string) => void
  validate?: (value?: string) => Partial<Record<string, string | null>> | null
}

export const DescriptionForm: React.FC<DescriptionFormProps> = ({
  value,
  onChange,
  validate,
}) => (
  <>
    <RichTextEditor
      placeholder="Description"
      value={value}
      onChange={onChange}
    />
    <p className={styles.errorText}>
      {validate?.(value)?.this ?? validate?.(value)?.description}
    </p>
  </>
)
