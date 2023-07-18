import React from 'react'
import styles from './openSource.module.scss'
import { Box } from '@mui/material'
import Button from './button'
import { LandingPageSectionProps } from '@app/pages'

const OpenSource = ({ className = '' }: LandingPageSectionProps) => {
  const handleButtonClick = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }

  return (
    <Box className={`${styles.openSource} ${className}`} data-cy="openSource">
      <h2 className={styles.preTitle}>We are a community. We are a team.</h2>
      <h1 className={styles.title}>WE ARE OPEN SOURCE</h1>
      <p className={styles.description}>
        What better way than to strive to be the best than with out community.
        Help us build the best tournament platform of tomorrow.
      </p>
      <Box className={styles.buttonWrapper}>
        <Button
          color="primary"
          data-cy="openSourceGithubButton"
          onClick={() =>
            handleButtonClick('https://github.com/etournity/etournity')
          }
        >
          Join the Team
        </Button>
        <Button
          color="plain"
          data-cy="openSourceVideoButton"
          onClick={() =>
            handleButtonClick('https://www.youtube.com/watch?v=2D4ryfEDFvI')
          }
        >
          Watch Video
        </Button>
      </Box>
    </Box>
  )
}

export default OpenSource
