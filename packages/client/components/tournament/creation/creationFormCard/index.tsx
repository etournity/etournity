import { Button } from '@components/ui/button'
import { Card, CardProps } from '@components/ui/card'
import classNames from 'classnames'
import React from 'react'
import styles from './creationFormCard.module.scss'

interface CreationFormCardProps extends CardProps {
  onConfirm?: () => void
  onBack?: () => void
  hasBack?: boolean
}

export const CreationFormCard: React.FC<CreationFormCardProps> = ({
  disabled,
  insetTitle = true,
  headerColor = styles.primary,
  children,
  onConfirm,
  onBack,
  hasBack = true,
  ...rest
}) => (
  <Card
    className={styles.card}
    insetTitle={insetTitle}
    disabled={disabled}
    headerColor={headerColor}
    {...rest}
  >
    {children}
    <div
      className={classNames(styles.buttonRow, {
        [styles.hidden]: disabled,
      })}
    >
      <Button
        className={classNames({
          [styles.hidden]: !hasBack,
        })}
        variant="secondary"
        onClick={onBack}
      >
        Back
      </Button>
      <Button
        data-cy={
          rest.title?.toString()?.replace(/[^A-Z0-9]/gi, '') + 'Continue'
        }
        onClick={onConfirm}
      >
        Continue
      </Button>
    </div>
  </Card>
)
