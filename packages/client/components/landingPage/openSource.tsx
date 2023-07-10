import React from 'react'
import styles from './openSource.module.scss'
import { Box } from '@mui/material'
import Button from './button'
import { LandingPageSectionProps } from '@app/pages'

const OpenSource = ({ className = '' }: LandingPageSectionProps) => (
  <Box className={`${styles.openSource} ${className}`}>
    <h2 className={styles.preTitle}>We are a community. We are a team.</h2>
    <h1 className={styles.title}>WE ARE OPEN SOURCE</h1>
    <p className={styles.description}>
      What better way than to strive to be the best than with out community.
      Help us build the best tournament platform of tomorrow.
    </p>
    <Box className={styles.buttonWrapper}>
      {/*  TODO handle onClick for Buttons */}
      <Button color="primary">Join the Team</Button>
      <Button color="plain">Watch Video</Button>
    </Box>
  </Box>
)
export default OpenSource
