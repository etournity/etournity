import React, { ReactNode, useState, useEffect } from 'react'
import { Button } from '../button'
import { Modal, ModalActions } from '../modal'
import styles from './confirmationModal.module.scss'
import classNames from 'classnames'

export interface ConfirmationModalProps {
  title: string
  active: boolean
  description: ReactNode
  onPrimary: () => void
  onCancel: () => void
  note?: string
  className?: string
  primaryBtnName?: string
  secondaryBtnName?: string
  thirdBtnName?: string
  warning?: string
  type?: 'info' | 'danger'
  lockTime?: number
  onSecondaryAction?: () => void
  clickOutside?: boolean
  hideFlag?: boolean
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  note,
  active,
  onPrimary,
  onCancel,
  className,
  primaryBtnName,
  secondaryBtnName,
  thirdBtnName,
  onSecondaryAction,
  warning,
  type = 'info',
  lockTime = 3,
  clickOutside = false,
  hideFlag,
}) => {
  const [countdown, setCountdown] = useState<number>(lockTime)

  useEffect(() => {
    if (countdown > 0 && active) {
      setTimeout(() => setCountdown(countdown - 1), 1000)
    }

    if (countdown === 0 && !active) {
      setCountdown(lockTime)
    }
  }, [lockTime, countdown, active])
  return (
    <Modal
      hideCloseButton={!clickOutside}
      active={active}
      className={classNames(styles.confirmationModal, className)}
      onClose={onCancel}
    >
      <div className={styles.title}>
        {!hideFlag && (
          <img
            src="/assets/icons/flag.png"
            alt="Report Flag"
            width={24}
            height={24}
          />
        )}

        <p>{title}</p>
      </div>
      <div className={styles.content}>
        {warning && <p className={styles.note}>{warning}</p>}
        <p>{description}</p>
        {note && <p className={styles.note}>Note: {note}</p>}
      </div>

      <ModalActions
        className={classNames(styles.actionsWrapper, {
          [styles.stacked]: thirdBtnName,
        })}
      >
        {thirdBtnName && (
          <Button
            variant="tertiary"
            onClick={() => {
              onCancel()
            }}
          >
            {thirdBtnName ?? 'Cancel'}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            onSecondaryAction?.()
            if (!thirdBtnName) onCancel()
          }}
        >
          {secondaryBtnName ?? 'Cancel'}
        </Button>

        <Button
          disabled={type === 'danger' && countdown > 0}
          variant={type === 'danger' ? 'error' : 'primary'}
          onClick={() => {
            onPrimary()
          }}
        >
          {type === 'danger'
            ? `${countdown > 0 ? `(${countdown})` : ''} ${primaryBtnName}`
            : primaryBtnName ?? 'Confirm'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
