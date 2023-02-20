import { Button } from '@components/ui/button'
import { ConfirmationModal } from '@components/ui/confirmationModal'
import { Modal, ModalProps } from '@components/ui/modal'
import {
  baseCreationValues,
  baseForms,
  CreationFormValues,
  validateCreationFormsTogether,
} from '@pages/tournament/new'
import React, { useState } from 'react'
import EditForms from '../creation/editForms/editForms'
import styles from './tournamentEditingModal.module.scss'

export interface TournamentEditingModalProps
  extends Omit<ModalProps, 'children' | 'onSubmit'> {
  onSubmit: (values: CreationFormValues) => void
  initialValues?: CreationFormValues
}

export const TournamentEditingModal = ({
  onClose,
  onSubmit,
  initialValues,
  ...rest
}: TournamentEditingModalProps) => {
  const [formValues, setFormValues] = useState<CreationFormValues>(
    initialValues ?? baseCreationValues
  )
  const [errors, setErrors] = useState<Record<string, string> | null>()
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)

  const applyChanges = async () => {
    const result = await validateCreationFormsTogether(formValues)
    if (result) setErrors(result)
    else onSubmit(formValues)
  }

  const discardChanges = () => {
    setFormValues(initialValues ?? baseCreationValues)
    setErrors(null)
    setConfirmationModalOpen(false)
    onClose?.()
  }

  const cancelDiscard = () => {
    setConfirmationModalOpen(false)
  }

  return (
    <>
      <Modal
        hideCloseButton
        disablePadding
        width="55rem"
        className={styles.modal}
        variant="scroll"
        stickyContent={
          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={() => setConfirmationModalOpen(true)}
            >
              Discard Changes
            </Button>
            <Button onClick={applyChanges}>Apply Changes</Button>
          </div>
        }
        onClose={() => setConfirmationModalOpen(true)}
        {...rest}
      >
        <div className={styles.wrapper}>
          <EditForms
            className={styles.form}
            mode="edit"
            formValues={formValues}
            forms={baseForms(formValues)}
            errors={errors}
            onChange={(values) => setFormValues(values)}
          />
        </div>
      </Modal>
      <ConfirmationModal
        active={confirmationModalOpen}
        title="Discard Changes?"
        warning="YOU HAVE UNSAVED CHANGES"
        description="Do you want to continue editing or discard your changes?"
        primaryBtnName="Continue Editing"
        secondaryBtnName="Discard"
        onPrimary={cancelDiscard}
        onCancel={discardChanges}
      />
    </>
  )
}
