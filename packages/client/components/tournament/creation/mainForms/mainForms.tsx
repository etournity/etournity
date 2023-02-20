import { CreationFormCard } from '@components/tournament/creation/creationFormCard'
import {
  BaseForm,
  CreationFormValues,
  validateCreationFormsIndividually,
} from '@pages/tournament/new'
import React from 'react'
import { ValueOf } from 'type-fest'
import styles from './mainForms.module.scss'

interface MainFormProps {
  formValues: CreationFormValues
  forms: BaseForm[]
  onChange?: (value: CreationFormValues) => void
  onValidSubmit?: () => void
}

const MainForms = ({
  formValues,
  onChange,
  onValidSubmit,
  forms,
}: MainFormProps) => {
  const [errors, setErrors] = React.useState<Partial<
    Record<keyof CreationFormValues, string | null>
  > | null>(null)
  const [activeForm, setActiveForm] = React.useState<number>(0)

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageIndicator}>{`${activeForm + 1}/${
        forms?.length
      }`}</div>
      <div className={styles.forms}>
        {forms
          ?.filter((_, i) => i >= activeForm)
          ?.map((form, index) => (
            <CreationFormCard
              key={index}
              data-cy={form.title?.replace(/[^A-Z0-9]/gi, '') + 'Form'}
              title={form.title}
              disabled={index !== 0}
              hasBack={activeForm !== 0}
              onConfirm={async () => {
                const result = await validateCreationFormsIndividually(
                  formValues[form.name],
                  form.name
                )
                if (result) {
                  setErrors(result)
                } else if (activeForm === forms?.length - 1) {
                  onValidSubmit?.()
                } else {
                  setActiveForm(activeForm + 1)
                }
              }}
              onBack={() => setActiveForm(activeForm > 0 ? activeForm - 1 : 0)}
            >
              {React.cloneElement(form.form, {
                value: formValues?.[form.name],
                validate: () => errors?.[form.name],
                onChange: (value: ValueOf<CreationFormValues>) => {
                  setErrors(null)
                  onChange?.({
                    ...formValues,
                    [form.name]: value,
                  })
                },
              })}
            </CreationFormCard>
          ))}
      </div>
    </div>
  )
}

export default MainForms
