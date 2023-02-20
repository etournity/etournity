import { TicketCreateModal } from '@components/tournament/lobby/ticketCreation/ticketCreateModal'
import { Button } from '@components/ui/button'
import classNames from 'classnames'
import React, { ReactNode, useState } from 'react'
import { Except } from 'type-fest'
import { Empty, EmptyProps } from '../ui/empty'
import { Icon } from '../ui/icon'
import styles from './errorResult.module.scss'

interface ErrorResultProps extends Except<Partial<EmptyProps>, 'actions'> {
  className?: string
  hideReportButton?: boolean
  customActions?: ReactNode | ReactNode[]
}

export const ErrorResult: React.FC<ErrorResultProps> = ({
  className,
  description = "We're as clueless as you are 😵",
  icon = <Icon variant="closeCircle" size={4} />,
  title = 'An error has occurred',
  hideReportButton,
  customActions,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={classNames(styles.wrapper, className)}>
        <Empty
          icon={icon}
          title={title}
          description={description}
          actions={[
            !hideReportButton && (
              <Button
                key="reportButton"
                variant="error"
                onClick={() => setOpen(true)}
              >
                Report this problem
              </Button>
            ),
            customActions,
          ]}
        />
      </div>
      {!hideReportButton && (
        <TicketCreateModal open={open} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
