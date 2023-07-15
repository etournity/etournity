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
import useVideosLoaded from '@utils/useVideosLoaded'

const Spacer = ({ className = '' }: LandingPageSectionProps) => (
  <Box className={`${styles.spacer} ${className}`} />
)

export interface LandingPageSectionProps {
  className?: string
}

const LandingPage = () => {
  const allVideosLoaded = useVideosLoaded()
  const [tetrisLoaded, setTetrisLoaded] = React.useState(false)
  const loadingClassName = allVideosLoaded && tetrisLoaded ? '' : styles.loading

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  return (
    <Box className={`${styles.landingPage} ${loadingClassName}`}>
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

      <Tetris setLoaded={(l) => setTetrisLoaded(l)} />
    </Box>
  )
}

export default LandingPage
