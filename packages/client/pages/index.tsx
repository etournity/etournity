import React, { useEffect } from 'react'
import styles from './landingpage.module.scss'
import Box from '@mui/material/Box'
import {
  Header,
  Features,
  FindLobby,
  MoreInfo,
  OpenSource,
  Community,
  Tetris,
} from '@components/landingPage'

const Spacer = ({ className = '' }: LandingPageSectionProps) => (
  <Box className={`${styles.spacer} ${className}`} />
)

export interface LandingPageSectionProps {
  className?: string
}

const LandingPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  return (
    <Box className={`${styles.landingPage}`} data-cy="landingpage">
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

      <Tetris />
    </Box>
  )
}

export default LandingPage
