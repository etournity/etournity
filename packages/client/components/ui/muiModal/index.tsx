import React from 'react'
import styles from './muiModal.module.scss'
import {
  Box,
  Card,
  CardActions,
  Modal,
  ModalProps,
  Typography,
} from '@mui/material'
import classNames from 'classnames'
import { Except } from 'type-fest'

export const MuiModalActions: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <CardActions className={classNames(styles.modalActions, className)}>
    {children}
  </CardActions>
)

export interface MuiModalProps extends Except<ModalProps, 'children'> {
  title?: string
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode | React.ReactNode[]
}

export const MuiModal: React.FC<MuiModalProps> = ({
  open,
  children,
  icon,
  title,
  className,
  onClose,
}) => (
  <Modal open={open} className={styles.modal} onClose={onClose}>
    <Card className={classNames(styles.card, className)} elevation={0}>
      {icon && <Box className={styles.icon}>{icon}</Box>}
      {title && (
        <Typography variant="headline" className={styles.title}>
          {title}
        </Typography>
      )}
      <Box className={styles.content}>{children}</Box>
    </Card>
  </Modal>
)
