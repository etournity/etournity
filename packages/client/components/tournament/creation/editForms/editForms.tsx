import { GameInformationForm } from '@components/tournament/creation/creationForms/gameInformationForm'
import { Card } from '@components/ui/card'
import { Empty } from '@components/ui/empty'
import { Icon } from '@components/ui/icon'
import { BaseForm, CreationFormValues } from '@pages/tournament/new'
import classNames from 'classnames'
import React from 'react'
import { ValueOf } from 'type-fest'
import styles from './editForms.module.scss'

interface EditFormProps {
  mode: 'edit' | 'summary'
  formValues: CreationFormValues
  forms: BaseForm[]
  onChange?: (value: CreationFormValues) => void
  errors?: Partial<Record<string, string | null>> | null
  className?: string
}

const EditForms: React.FC<EditFormProps> = ({
  mode,
  formValues,
  forms,
  onChange,
  errors,
  className,
}) => {
  const addedForms: BaseForm[] = [
    {
      title: 'Game Information',
      name: 'gameInformation',
      form: (
        <GameInformationForm
          gameModes={[
            {
              id: '1',
              title: '1 v 1',
              value: 1,
            },
          ]}
        />
      ),
    },
  ]

  if (!(forms?.length > 0))
    return (
      <Empty
        title="ERROR"
        description="One of our devs messed up the form loading"
        icon={<Icon variant="closeCircle" size={4} />}
      />
    )

  return (
    <div className={classNames(styles.wrapper, className)}>
      {[...addedForms, ...forms].map((form, index) => (
        <Card
          key={index}
          insetTitle
          headerColor={mode === 'summary' ? styles.white : styles.ashBlack}
          title={form.title}
          className={styles.card}
        >
          {React.cloneElement(form.form, {
            value: formValues?.[form.name],
            validate: () => errors,
            onChange: (value: ValueOf<CreationFormValues>) =>
              onChange?.({
                ...formValues,
                [form.name]: value,
              }),
          })}
        </Card>
      ))}
    </div>
  )
}

export default EditForms
