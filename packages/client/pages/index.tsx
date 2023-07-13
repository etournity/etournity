import React from 'react'
import styles from './landingpage.module.scss'
import Box from '@mui/material/Box'
import {
  Header,
  Features,
  FindLobby,
  MoreInfo,
  OpenSource,
  Community,
} from '@components/landingPage'

const Spacer = ({ className = '' }: LandingPageSectionProps) => (
  <Box className={`${styles.spacer} ${className}`} />
)

export interface LandingPageSectionProps {
  className?: string
}

const LandingPage = () => (
  <Box className={styles.landingPage}>
    <Header />
    <Spacer />

    <Features />
    <Spacer />

    <FindLobby />
    <Spacer />

    <MoreInfo className={styles.sectionDark} />
    <Spacer className={styles.sectionDark} />

    <OpenSource className={styles.sectionDark} />

    <Community />
  </Box>
)

export default LandingPage
