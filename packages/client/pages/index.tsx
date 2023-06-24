import React from 'react'
import styles from './landingpage.module.scss'
import Box from '@mui/material/Box'
import { Header, Features, FindLobby } from '@components/landingPage'

const Spacer = () => <Box className={styles.spacer} />

const LandingPage = () => (
  <Box className={styles.landingPage}>
    <Header />
    <Spacer />
    <Features />
    <Spacer />
    <FindLobby />
    <Spacer />
  </Box>
)

export default LandingPage
