import styles from '@components/landingPage/sectionTitle.module.scss'
import Box from '@mui/material/Box'
import React from 'react'

interface SectionTitleProps {
  title: string
  description?: string
  className?: string
}

const SectionTitle = ({
  title,
  description = '',
  className = '',
}: SectionTitleProps) => (
  <Box className={`${styles.container} ${className}`}>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
  </Box>
)

export default SectionTitle
