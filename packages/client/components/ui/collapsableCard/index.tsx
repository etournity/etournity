import React, { useState, ReactElement, useLayoutEffect } from 'react'

import { Paper, Box, Typography, Collapse, PaperProps } from '@mui/material'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import styles from './collapsableCard.module.scss'
import classNames from 'classnames'

interface CollapsableCardProps extends PaperProps {
  children: ReactElement
  title?: string
  collapsedSize?: number | string
  noTitleMargin?: boolean
}

export const CollapsableCard: React.FC<CollapsableCardProps> = ({
  children,
  className,
  sx,
  title,
  noTitleMargin = false,
  collapsedSize = 100,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)

  const contentId =
    children.props.id ?? `collapsable-card-content-${Math.random()}`

  const showToggle = contentHeight > collapsedSize

  useLayoutEffect(() => {
    setContentHeight(document.getElementById(contentId)?.clientHeight ?? 0)
  }, [contentId])
  return (
    <Paper
      className={classNames(styles.collapsableCard, className)}
      sx={sx}
      elevation={0}
    >
      <Box>
        <Typography
          className={styles.title}
          variant="title"
          sx={{ marginBottom: noTitleMargin ? 0 : '0.5rem' }}
        >
          {title}
        </Typography>
        <Collapse in={isOpen} collapsedSize={collapsedSize}>
          <children.type id={contentId} {...children.props} />
        </Collapse>
      </Box>
      {showToggle &&
        (isOpen ? (
          <Box className={styles.expandToggle} onClick={() => setIsOpen(false)}>
            <ArrowDropUpIcon />
            <Typography variant="label">Collapse</Typography>
          </Box>
        ) : (
          <Box className={styles.expandToggle} onClick={() => setIsOpen(true)}>
            <ArrowDropDownIcon />
            <Typography variant="label">Expand</Typography>
          </Box>
        ))}
    </Paper>
  )
}
